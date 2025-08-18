# app/routes/matcher.py
from flask import Blueprint, request, jsonify
from app.controllers.resumematchercontroller import extract_text, match_resume
from app.middleware.auth_middleware import verify_jwt  # your existing decorator
import io

matcher_bp = Blueprint("matcher", __name__)

@matcher_bp.route("/resume-matcher", methods=["POST"])
@verify_jwt
def resumematcher():
    try:
        # Validate presence of parts
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400

        if 'jobDescription' not in request.form or not request.form['jobDescription'].strip():
            return jsonify({"error": "Job description is required"}), 400

        resume_file = request.files['resume']
        job_description = request.form['jobDescription'].strip()

        if not resume_file.filename:
            return jsonify({"error": "No selected file"}), 400

        # Extract text
        raw_bytes = resume_file.read()
        if not raw_bytes:
            return jsonify({"error": "Uploaded file is empty"}), 400

        resume_text = extract_text(io.BytesIO(raw_bytes), resume_file.filename)
        if resume_text is None:
            ext = resume_file.filename.rsplit(".", 1)[-1].lower() if "." in resume_file.filename else ""
            if ext == "doc":
                return jsonify({
                    "error": "Legacy .doc is not supported. Please upload PDF, DOCX, or TXT."
                }), 400
            return jsonify({"error": "Failed to extract text from resume"}), 400

        # Compute match
        result = match_resume(resume_text, job_description)

        # Ensure JSON-serializable (convert sets to sorted lists)
        response = {
            "overall_score": result.get("overall_score", 0.0),
            "skill_match_score": result.get("skill_match_score", 0.0),
            "similarity_score": result.get("similarity_score", 0.0),
            "matching_skills": sorted(list(result.get("matching_skills", []))),
            "missing_skills": sorted(list(result.get("missing_skills", []))),
        }

        return jsonify(response), 200

    except Exception as e:
        # Log the real error server-side, return friendly message to client
        print("Server Error in /resume-matcher:", repr(e))
        return jsonify({"error": "Internal server error"}), 500
