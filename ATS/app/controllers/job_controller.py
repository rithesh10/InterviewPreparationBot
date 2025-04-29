from flask import Blueprint, request, jsonify
from db.db import mongo
from bson import ObjectId
from datetime import datetime, timezone
from app.models.job_model import job_schema, jobs_schema
from app.middleware.auth_middleware import verify_jwt

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email Config (Gmail SMTP)
SENDER_EMAIL = 'skillup.2x@gmail.com'
SENDER_PASSWORD = 'xrlp qive amkt radm'  # Use App Password if 2FA enabled
RECIPIENT_EMAIL = 'varshithkumar1001@gmail.com'

def send_job_email(job_data):
    try:
        required_skills = job_data.get('required_skills', [])
        if isinstance(required_skills, str):
            required_skills = [required_skills] 
        
        subject = f"🚀 New Job Alert: {job_data['title']} at {job_data['company']}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #2c3e50;">🎯 {job_data['title']}</h2>
                    <h3 style="color: #3498db;">🏢 {job_data['company']}</h3>
                    <hr style="border: 1px solid #eee;">
                    
                    <p><strong>📝 Description:</strong><br>{job_data['description']}</p>
                    
                    <p><strong>🔧 Skills Required:</strong><br>
                     {', '.join(required_skills)}</p>
                    
                    <p><strong>📅 Posted:</strong> {job_data['posted_date'].strftime('%b %d, %Y')}</p>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://leetcode.com/problemset/" 
                           style="background-color: #3498db; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px;">
                            ✨ Apply Now
                        </a>
                    </div>
                    
                    <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
                        Don't want these alerts? <a href="https://yourwebsite.com/unsubscribe">Unsubscribe</a>
                    </p>
                </div>
            </body>
        </html>
        """

        # ===== Send Email via Gmail SMTP =====
        message = MIMEMultipart('alternative')
        message['From'] = f"SkillUp Jobs <{SENDER_EMAIL}>"
        message['To'] = RECIPIENT_EMAIL
        message['Subject'] = subject
        message.attach(MIMEText(html_content, 'html'))
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)
        
        print("✅ Email sent via Gmail SMTP!")
        return True

    except Exception as e:
        print("❌ Email failed:", str(e))
        return False

def createJob(data):
    try:
        errors = job_schema.validate(data)
        if errors:
            return jsonify({"error": errors}), 400

        data["posted_date"] = datetime.now(timezone.utc)
        job_id = mongo.db.jobs.insert_one(data).inserted_id

        # Send email (with retries if needed)
        email_sent = send_job_email(data)
        
        if not email_sent:
            return jsonify({
                "message": "Job created but email failed",
                "job_id": str(job_id)
            }), 201
        
        return jsonify({
            "message": "Job created successfully ✅",
            "job_id": str(job_id)
        }), 201
        
    except Exception as e:
        return jsonify({
            "error": "An error occurred",
            "details": str(e)
        }), 500

# def createJob(data):
#     try:
#         errors = job_schema.validate(data)
#         if errors:
#             return jsonify({"error": errors}), 400

#         data["posted_date"] = datetime.now(timezone.utc)
#         job_id = mongo.db.jobs.insert_one(data).inserted_id

#         return jsonify({"message": "Job created successfully", "job_id": str(job_id)}), 201
#     except Exception as e:
#         return jsonify({"error": "An error occurred", "details": str(e)}), 500

def getAllJobs():
    try:
        jobs = list(mongo.db.jobs.find())
        # print(jobs)
        for job in jobs:
            job["_id"] = str(job["_id"])

        return jsonify({"jobs": jobs}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def getJobById(id):
    try:
        job = mongo.db.jobs.find_one({"_id": ObjectId(id)})
        if not job:
            return jsonify({"message": "Job not found"}), 404

        job["_id"] = str(job["_id"])
        return jsonify({"job": job}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def updateJob(id,data):
    try:
        data = request.json
        errors = job_schema.validate(data, partial=True)
        if errors:
            return jsonify({"error": errors}), 400

        update_result = mongo.db.jobs.update_one({"_id": ObjectId(id)}, {"$set": data})

        if update_result.matched_count == 0:
            return jsonify({"message": "Job not found"}), 404

        return jsonify({"message": "Job updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def deleteJob(id):
    try:
        delete_result = mongo.db.jobs.delete_one({"_id": ObjectId(id)})

        if delete_result.deleted_count == 0:
            return jsonify({"message": "Job not found"}), 404

        return jsonify({"message": "Job deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500