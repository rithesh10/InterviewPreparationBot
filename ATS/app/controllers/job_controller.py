from flask import Blueprint, request, jsonify
from db.db import mongo
from bson import ObjectId
from datetime import datetime, timezone
from app.models.job_model import job_schema, jobs_schema
from app.middleware.auth_middleware import verify_jwt

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SENDER_EMAIL = 'skillup.2x@gmail.com'
SENDER_PASSWORD = 'xrlp qive amkt radm' 
RECIPIENT_EMAIL = 'gokulkashyapgannamaraju@gmail.com'
def send_job_email(job_data):
    try:
        required_skills = job_data.get('required_skills', [])
        if isinstance(required_skills, str):
            required_skills = [required_skills] 
        
        subject = f"🌟🔥 {job_data['title']} @ {job_data['company']} - Your Dream Job Awaits! 🔥🌟"
        
        html_content = f"""
        <html>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 650px; margin: 0 auto; color: #333;">
                <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #2c3e50; margin-bottom: 5px;">✨ {job_data['title']} ✨</h1>
                        <h2 style="color: #3498db; margin-top: 0;">🏛️ {job_data['company']}</h2>
                        <div style="background: #e74c3c; color: white; display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin: 10px 0;">🚨 HOT JOB ALERT 🚨</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #2c3e50; border-bottom: 2px dashed #eee; padding-bottom: 10px;">📋 Job Snapshot</h3>
                        
                        <p><span style="font-weight: bold; color: #e74c3c;">📝 Description:</span><br>
                        {job_data['description']}</p>
                        
                        <p><span style="font-weight: bold; color: #e74c3c;">🛠️ Tech Stack:</span><br>
                        {', '.join(required_skills)}</p>
                        
                        <p><span style="font-weight: bold; color: #e74c3c;">📍 Location:</span> 🌍 {job_data.get('location', 'Remote')}</p>
                        
                        <p><span style="font-weight: bold; color: #e74c3c;">💰 Salary:</span> 💵 {job_data.get('salary', 'Competitive')}</p>
                        
                        <p><span style="font-weight: bold; color: #e74c3c;">📅 Posted:</span> 🗓️ {job_data['posted_date'].strftime('%b %d, %Y')}</p>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
                        <p style="margin: 0;">⏳ <strong>Hurry!</strong> This position may fill up quickly!</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #95a5a6;">
                        <p>🌟 You're receiving this because you're awesome! 🌟</p>
                    </div>
                </div>
            </body>
        </html>
        """

        message = MIMEMultipart('alternative')
        message['From'] = f"🚀 SkillUp Jobs <{SENDER_EMAIL}>"
        message['To'] = RECIPIENT_EMAIL
        message['Subject'] = subject
        message.attach(MIMEText(html_content, 'html'))
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)
        
        print("✅ Email sent successfully via Gmail SMTP!")
        return True

    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False
def createJob(data):
    try:
        errors = job_schema.validate(data)
        if errors:
            return jsonify({"error": errors}), 400

        data["posted_date"] = datetime.now(timezone.utc)
        job_id = mongo.db.jobs.insert_one(data).inserted_id

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