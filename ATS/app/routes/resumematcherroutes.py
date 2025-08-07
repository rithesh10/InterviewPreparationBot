from flask import Blueprint, request, jsonify
from app.controllers.resumematchercontroller import extract_text, match_resume
from app.middleware.auth_middleware import verify_jwt
import io

job_bp = Blueprint("matcher", __name__)

@job_bp.route("/resume-matcher", methods=["POST"])
@verify_jwt
def resumematcher():
    print("ekrjgne")
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
        
        resume_file = request.files['resume']
        
        if 'jobDescription' not in request.form or not request.form['jobDescription'].strip():
            return jsonify({"error": "Job description is required"}), 400
        
        job_description = request.form['jobDescription']
        
        if resume_file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        resume_text = extract_text(io.BytesIO(resume_file.read()), resume_file.filename)
        if not resume_text:
            return jsonify({"error": "Failed to extract text from resume"}), 400
        
        match_percent, missing_keywords = match_resume(resume_text, job_description)
        
        response = {
            "score": match_percent,
            "missingKeywords": sorted(list(missing_keywords)) if missing_keywords else []
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500