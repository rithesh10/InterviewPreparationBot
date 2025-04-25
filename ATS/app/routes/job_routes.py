from flask import Blueprint, request, jsonify
from app.controllers.job_controller import createJob,getAllJobs,getJobById,updateJob,deleteJob
from app.middleware.auth_middleware import verify_jwt
job_bp = Blueprint("jobs", __name__)

# Create a Job
@job_bp.route("/jobs", methods=["POST"])
@verify_jwt
def create_job():
   data=request.get_json()
   return createJob(data)
# Get All Jobs
@job_bp.route("/jobs", methods=["GET"])
@verify_jwt
def get_all_jobs():
    return getAllJobs()
    

# Get Job by ID
@job_bp.route("/job/<id>", methods=["GET"])
@verify_jwt
def get_job(id):
    return getJobById(id)
# Update Job by ID
@job_bp.route("/jobs/<id>", methods=["PUT"])
@verify_jwt
def update_job(id):
    data=request.get_json()
    return updateJob(id,data)
   

# Delete Job by ID
@job_bp.route("/jobs/<id>", methods=["DELETE"])
@verify_jwt
def delete_job(id):
   return deleteJob(id)
