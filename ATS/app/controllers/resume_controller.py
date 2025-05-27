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

resume_schema=ResumeSchema()

UPLOAD_FOLDER = "public/temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)   

ALLOWED_EXTENSIONS = {"pdf", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text(file, filename):
    """
    Extracts text from PDF, DOC, and DOCX files.
    """
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
        resume_url = upload_to_cloudinary(file)
        
        user_name=g.user["full_name"]
        user_id = g.user["_id"]  
        skills = request.form.getlist("skills")  
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
        object_id=ObjectId(id)
        resumes=mongo.db.resume.find({"user_id":id})
        resume_list=list(resumes)
        if not resume_list:
             return jsonify({"message": "No resumes found"}), 404
        for resume in resume_list:
            resume["_id"]=str(resume["_id"])
        return jsonify({
            "message":"Fetched successfully",
            "resumes":resume_list
        }),200
    except Exception as e:
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
