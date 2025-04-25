from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime,timezone

from app import mongo  # Import MongoDB instance
from app.models.Ranking_Model import resume_ranking_schema,resume_rankings_schema
from app.ML.main import find_the_fields,find_the_score
# def get_resume_ranking(request, id):
#     try:
#         object_id = ObjectId(id)
#     except InvalidId:
#         return JsonResponse({"error": "Invalid ID format"}, status=400)

#     ranking = db.resume_rankings.find_one({"_id": object_id})
#     if not ranking:
#         return JsonResponse({"error": "Resume ranking not found"}, status=404)

#     ranking["_id"] = str(ranking["_id"])
#     serialized = resume_ranking_schema.dump(ranking)
#     return JsonResponse(serialized, status=200)
def add_resume_ranking():
    data = request.json

    # Fetch resume and job details
    resume = mongo.db.resume.find_one({"_id": ObjectId(data["resume_id"])})
    job = mongo.db.jobs.find_one({"_id": ObjectId(data["job_id"])})

    if not job or not resume:
        return jsonify({"message": "Couldn't find the resume or job data"}), 404

    # AI-based scoring & skill matching
    ai_score = find_the_score(resume["resume_text"], job["description"])
    matching_skills = find_the_fields(resume["resume_text"], job["skills_required"])
    print(matching_skills)

    # Identify missing skills (skills required by job but not in resume)
    missing_skills = [skill for skill in job["skills_required"] if skill not in matching_skills]
    experience_mapping = {
    "Entry-Level": 0,
    "Mid-Level": 2,
    "Senior": 5
        }
    job_experience_level = job["experience_level"]

# Ensure job experience is an integer
    if isinstance(job_experience_level, str):
         job_experience_level = experience_mapping.get(job_experience_level, 0)
    # Construct the ranking data
    data.update({
        "ai_score": ai_score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "suggestions": "Improve your skills to match the job requirements",
        "experience_match": resume["experience"] >= job_experience_level,
        # "created_at": datetime.now()  # Local time
    })

    # Validate data against schema
    errors = resume_ranking_schema.validate(data)
    if errors:
        return jsonify({"error": errors}), 400

    # Insert into database
    inserted_id = mongo.db.resume_rankings.insert_one(data).inserted_id

    return jsonify({"message": "Resume ranking added", "id": str(inserted_id)}), 201
def get_resume_ranking(id):
    ranking = mongo.db.resume_rankings.find_one({"_id": ObjectId(id)})
    if not ranking:
        return jsonify({"error": "Resume ranking not found"}), 404

    ranking["_id"] = str(ranking["_id"])
    return jsonify(resume_ranking_schema.dump(ranking)), 200
from bson import ObjectId
from flask import jsonify

def get_all_resume_rankings(id):
    try:
        # Ensure job_id is treated correctly
        rankings = list(mongo.db.resume_rankings.find({"job_id": id}).sort("ai_score", -1))

        if not rankings:
            return jsonify({"message": "No resume rankings found for this job"}), 404

        # Convert ObjectId fields to string for JSON serialization
        for ranking in rankings:
            ranking["_id"] = str(ranking["_id"])
            # print(ranking)
            user=mongo.db.users.find_one({"_id":ObjectId(ranking["user_id"])})
            # print(user["full_name"])
            ranking["full_name"]=user["full_name"]

        return jsonify(rankings), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_resume_ranking(id):
    data = request.json

    existing_ranking = mongo.db.resume_rankings.find_one({"_id": ObjectId(id)})
    if not existing_ranking:
        return jsonify({"error": "Resume ranking not found"}), 404

    mongo.db.resume_rankings.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return jsonify({"message": "Resume ranking updated successfully"}), 200
def delete_resume_ranking(id):
    result = mongo.db.resume_rankings.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Resume ranking not found"}), 404

    return jsonify({"message": "Resume ranking deleted successfully"}), 200
def get_top_n_resumes(n):
    rankings = list(mongo.db.resume_rankings.find().sort("ai_score", -1).limit(n))

    for ranking in rankings:
        ranking["_id"] = str(ranking["_id"])

    return jsonify(resume_rankings_schema.dump(rankings)), 200
def get_resumes_by_matching_skills():
    data = request.json
    skills = data.get("skills", [])

    if not skills:
        return jsonify({"error": "Skills list is required"}), 400

    rankings = list(mongo.db.resume_rankings.find({"matching_skills": {"$in": skills}}))

    for ranking in rankings:
        ranking["_id"] = str(ranking["_id"])

    return jsonify(resume_rankings_schema.dump(rankings)), 200
def add_resume_ranking_for_job(job_id):
    """Process all resumes associated with a given job_id and rank them if not already ranked."""
    # Fetch all resumes for the job
    resumes = list(mongo.db.resume.find({"job_id": job_id}))
    job = mongo.db.jobs.find_one({"_id": ObjectId(job_id)})

    if not job or not resumes:
        return jsonify({"message": "Couldn't find job or resumes"}), 404

    experience_mapping = {
        "Entry-Level": 0,
        "Mid-Level": 2,
        "Senior": 5
    }
    print("processing")
    job_experience_level = job.get("experience_level", 0)
    if isinstance(job_experience_level, str):
        job_experience_level = experience_mapping.get(job_experience_level, 0)

    ranked_resumes = []  # List to store ranked resumes before insertion

    for resume in resumes:
        # Check if this resume has already been ranked for this job
        existing_ranking = mongo.db.resume_rankings.find_one({
            "resume_id": str(resume["_id"]),
            "job_id": job_id
        })

        if existing_ranking:
            continue  # Skip already ranked resume

        ai_score = find_the_score(resume["resume_text"], job["description"])
        matching_skills = find_the_fields(resume["resume_text"], job["skills_required"])
        missing_skills = [skill for skill in job["skills_required"] if skill not in matching_skills]
        user_id = resume["user_id"]

        ranking_data = {
            "resume_id": str(resume["_id"]),
            "job_id": job_id,
            "ai_score": ai_score,
            "user_id": user_id,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "suggestions": "Improve your skills to match the job requirements",
            "experience_match": resume["experience"] >= job_experience_level
        }

        ranked_resumes.append(ranking_data)

    if ranked_resumes:
        mongo.db.resume_rankings.insert_many(ranked_resumes)

    return jsonify({
        "message": "Resume rankings processed successfully",
        "new_rankings_added": len(ranked_resumes)
    }), 201
