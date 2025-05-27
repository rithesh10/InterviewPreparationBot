from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime,timezone
import re

from app import mongo  
from app.models.Ranking_Model import resume_ranking_schema,resume_rankings_schema
from app.ML.main import find_the_fields,find_the_score
API_KEY="AIzaSyBXHxyQvTsXUoDB8pWiT0CF7ilGZoMzSE0"


import google.generativeai as genai
genai.configure(api_key=API_KEY)
import json

model = genai.GenerativeModel("gemini-1.5-pro-latest")
def add_resume_ranking_by_ResumeId(id):
    try:
        resume = mongo.db.resume.find_one({"_id": ObjectId(id)})
        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        job = mongo.db.jobs.find_one({"_id": ObjectId(resume["job_id"])})
        if not job:
            return jsonify({"error": "Job not found"}), 404

        prompt = f"""
        You are an expert recruiter.  
        I will give you:

        - A resume text
        - A job description
        - A list of skills required for the job

        Your tasks:
        1. Find which skills from the skills_required list are present in the resume.
        2. Score the resume out of 100 based on how well it matches the skills and the description.

        Return the result strictly in JSON format like this:
        {{
          "score": 92,
          "matching_skills": ["JavaScript", "React", "Node.js"]
        }}

        Here is the resume:
        \"\"\"{resume['resume_text']}\"\"\"

        Here is the job description:
        \"\"\"{job['description']}\"\"\"

        Here is the list of skills required:
        {job['skills_required']}
        """

        response = model.generate_content(prompt)
        response_text = re.sub(r'```json|```', '', response.text).strip()
        parsed_response = json.loads(response_text)

        print("Gemini Raw Response:", response.text)
        print("Parsed Response:", parsed_response)

        ai_score = parsed_response.get("score", 0)
        matching_skills = parsed_response.get("matching_skills", [])

        missing_skills = [skill for skill in job["skills_required"] if skill not in matching_skills]

        experience_mapping = {
            "Entry-Level": 0,
            "Mid-Level": 2,
            "Senior": 5
        }
        job_experience_level = job.get("experience_level", 0)
        if isinstance(job_experience_level, str):
            job_experience_level = experience_mapping.get(job_experience_level, 0)

        ranking_data = {
            "resume_id": str(resume["_id"]),
            "job_id": str(job["_id"]),
            "user_id": resume["user_id"],
            "ai_score": ai_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "suggestions": "Improve your skills to match the job requirements",
            "experience_match": resume.get("experience", 0) >= job_experience_level,
        }

        resume_score_data = {}
        try:
            resume_score_data = mongo.db.resume_rankings.insert_one(ranking_data)
        except Exception as db_error:
            print("Database Insert Error:", str(db_error))
            return jsonify({"error": "Failed to save ranking to database"}), 500

        return jsonify({"inserted_id": str(resume_score_data.inserted_id)}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Internal server error"}), 500

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
        rankings = list(mongo.db.resume_rankings.find({"job_id": id}).sort("ai_score", -1))

        if not rankings:
            return jsonify({"message": "No resume rankings found for this job"}), 404

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

    ranked_resumes = []

    for resume in resumes:
        existing_ranking = mongo.db.resume_rankings.find_one({
            "resume_id": str(resume["_id"]),
            "job_id": job_id
        })

        if existing_ranking:
            continue 

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
