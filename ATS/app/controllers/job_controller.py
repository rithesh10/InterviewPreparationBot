from flask import Blueprint, request, jsonify
from db.db import mongo
from bson import ObjectId
from datetime import datetime, timezone
from app.models.job_model import job_schema, jobs_schema
from app.middleware.auth_middleware import verify_jwt
import google.generativeai as genai
import requests
import json


# # Create the model instance
def createJob(data):
    try:
        # Add posted_date
        data["posted_date"] = datetime.now(timezone.utc).isoformat()
        # Now validate the complete data (with title, company, location, etc.)
        errors = job_schema.validate(data)
        if errors:
            return jsonify({"error": errors}), 400

        # Insert into MongoDB
        job = mongo.db.jobs.insert_one(data)

        return jsonify({"message": "Job created successfully", "job_id": str(job.inserted_id)}), 201

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