import os
from marshmallow import ValidationError
from flask import request, jsonify,g
from werkzeug.utils import secure_filename
from app.services.cloudinary_service import upload_to_cloudinary  
import fitz
from docx import Document
from app.models.Resume_Model import ResumeSchema
from datetime import datetime,timezone
from db.db import mongo
from bson import json_util, ObjectId
from app.services.redis_service import r
import json
import time
resume_schema=ResumeSchema()

UPLOAD_FOLDER = "public/temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)   

ALLOWED_EXTENSIONS = {"pdf", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text(file, filename):
    try:
        file_ext = filename.split(".")[-1].lower()

        if file_ext == "pdf":
            file.seek(0)
            pdf_document = fitz.open(stream=file.read(), filetype="pdf")
            text = "\n".join([page.get_text("text") for page in pdf_document])

        elif file_ext == "docx":
            file.seek(0)
            doc = Document(file)
            text = "\n".join([para.text for para in doc.paragraphs])

        else:
            return None

        return text.strip()

    except Exception as e:
        print("Error extracting text:", str(e))
        return None

def upload_resume():
    try:
     

        if "resume" not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files["resume"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)

      
        if not allowed_file(filename):
            return jsonify({"error": "Invalid file type. Only PDF and DOCX allowed"}), 400

        file.seek(0)  
        extracted_text = extract_text(file, filename)

        file.seek(0)  
        # resume_url = upload_to_cloudinary(file)
        resume_url=""
        
        user_name=g.user["full_name"]
        user_id = g.user["_id"]  
        skills = request.form.getlist("skills") 
        print(request.form.getlist("skills")) 
        experience = request.form.get("experience", 0)
        job_id=request.form.get("_id")
        try:
            experience = int(experience)
        except ValueError:
            return jsonify({"error": "Experience must be a valid integer"}), 400

        resume = {
            "user_id": user_id,
            "file_url": resume_url,
            "user_name":user_name,
            "skills": skills,
            "job_id":job_id,
            "experience": experience,
            "resume_text":extracted_text,
            # "created_at": datetime.now(timezone.utc)
        }
        # print(resume)

        errors = resume_schema.validate(resume)
        if errors:
            print(str(errors))
            return jsonify({"error": "Validation failed", "details": errors}), 400
        
        resume= mongo.db.resume.insert_one(resume)
        # print(resume)

        return jsonify({
            "message": "Resume uploaded successfully",
            # "resume": resume
        }), 201

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

def get_by_jobId(id):
    resumes = mongo.db.resume.find({"job_id": id})  
    resumes_list = list(resumes)  

    if not resumes_list:
        return jsonify({"message": "No resumes found"}), 404

    # Convert `_id` from ObjectId to string for all resumes
    for resume in resumes_list:
        resume["_id"] = str(resume["_id"])

    return jsonify({
        "message": "Fetched successfully",
        "resumes": resumes_list  
    }), 200

def get_by_user_id(id):
    try:
        cache_key=f"resumes:{id}"
        cached_resumes=r.get(cache_key)
        if cached_resumes:
            cached_resumes=json.loads(cached_resumes)
            return jsonify({
                "message": "Fetched successfully (from cache)",
                "resumes": cached_resumes
            }), 200
        object_id=ObjectId(id)
        resumes=mongo.db.resume.find({"user_id":id})
        resume_list=list(resumes)
        if not resume_list:
             return jsonify({"message": "No resumes found"}), 404
        for resume in resume_list:
            resume["_id"]=str(resume["_id"])
            for key,value in resume.items():
                if hasattr(value,"isoformat"):
                    resume[key]=value.isoformat()
        r.setex(cache_key,1800,json.dumps(resume_list))
        return jsonify({
            "message":"Fetched successfully",
            "resumes":resume_list
        }),200
    except Exception as e:
        print(str(e))
        return jsonify({"message":"Internal server error","details":str(e)}),500
def get_by_Id(id):
    try:
        object_id = ObjectId(id)  
    except:
        return jsonify({"message": "Invalid ID format"}), 400 

    resume = mongo.db.resume.find_one({"_id": object_id})  
    resume["_id"]=ObjectId(resume["_id"])
    if not resume:
        return jsonify({"message": "No resume found"}), 404  

    return jsonify({
        "message": "Fetched successfully",
        "resume": json_util.loads(json_util.dumps(resume)) 
    }), 200

def get_resumes_with_jobs(user_id):
    start_time = time.time()
    try:
        # 1️⃣ Cache key for resumes
        resumes_cache_key = f"resumes:{user_id}"
        cached_resumes = r.get(resumes_cache_key)
        if cached_resumes:
            resume_list = json.loads(cached_resumes)
        else:
            # Fetch resumes from MongoDB
            resumes_cursor = mongo.db.resume.find({"user_id": user_id})
            resume_list = list(resumes_cursor)
            if not resume_list:
                return jsonify({"message": "No resumes found"}), 404

            # Convert ObjectId and datetime
            for resume in resume_list:
                resume["_id"] = str(resume["_id"])
                for key, value in resume.items():
                    if hasattr(value, "isoformat"):
                        resume[key] = value.isoformat()

            # Cache resumes for 30 min
            r.setex(resumes_cache_key, 1800, json.dumps(resume_list))

        # 2️⃣ Collect all job IDs
        job_ids = list({resume.get("job_id") for resume in resume_list if resume.get("job_id")})
        jobs_dict = {}

        if job_ids:
            # Prepare Redis keys
            job_cache_keys = [f"job:{job_id}" for job_id in job_ids]
            cached_jobs = r.mget(job_cache_keys)

            missing_job_ids = []
            for idx, cached_job in enumerate(cached_jobs):
                job_id = job_ids[idx]
                if cached_job:
                    jobs_dict[job_id] = json.loads(cached_job)
                else:
                    missing_job_ids.append(job_id)

            # Fetch missing jobs from MongoDB
            if missing_job_ids:
                mongo_jobs = list(
                    mongo.db.jobs.find({"_id": {"$in": [ObjectId(j) for j in missing_job_ids]}})
                )
                for job in mongo_jobs:
                    job["_id"] = str(job["_id"])
                    for key, value in job.items():
                        if hasattr(value, "isoformat"):
                            job[key] = value.isoformat()
                    # Cache in Redis
                    r.setex(f"job:{job['_id']}", 1800, json.dumps(job))
                    jobs_dict[job["_id"]] = job

        # 3️⃣ Merge jobs into resumes
        for resume in resume_list:
            resume["job"] = jobs_dict.get(resume.get("job_id"))

        end_time = time.time()  # end timer
        print(f"Response time: {round((end_time - start_time)*1000, 2)} ms")
        return jsonify({
            "message": "Fetched successfully",
            "resumes": resume_list
        }), 200
    except Exception as e:
        return jsonify({"message": "Internal server error", "details": str(e)}), 500
