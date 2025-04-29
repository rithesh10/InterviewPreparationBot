from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import verify_jwt
from app.controllers.resume_ranks_controller import (
    add_resume_ranking_by_ResumeId, get_all_resume_rankings, get_resume_ranking,
    get_resumes_by_matching_skills, get_top_n_resumes,
    update_resume_ranking, delete_resume_ranking,add_resume_ranking_for_job
)

resume_ranking_bp = Blueprint("ranking", __name__)

@resume_ranking_bp.route("/resume-rankings-by-resume-id/<id>", methods=["GET"])
# @verify_jwt()
def secure_add_resume_ranking(id):
    return add_resume_ranking_by_ResumeId(id)

@resume_ranking_bp.route("/resume-rankings/<id>", methods=["GET"])
# @verify_jwt()
def secure_get_resume_ranking(id):
    return get_resume_ranking(id)

@resume_ranking_bp.route("/all-resume-rankings/<id>", methods=["GET"])
# @verify_jwt()
def secure_get_all_resume_rankings(id):
    return get_all_resume_rankings(id)

@resume_ranking_bp.route("/resume-rankings/<id>", methods=["PUT"])
# @verify_jwt()
def secure_update_resume_ranking(id):
    return update_resume_ranking(id)

@resume_ranking_bp.route("/resume-rankings/<id>", methods=["DELETE"])
# @verify_jwt()
def secure_delete_resume_ranking(id):
    return delete_resume_ranking(id)

@resume_ranking_bp.route("/resume-rankings/top/<int:n>", methods=["GET"])
# @verify_jwt()
def secure_get_top_n_resumes(n):
    return get_top_n_resumes(n)

@resume_ranking_bp.route("/resume-rankings/match-skills", methods=["POST"])
# @verify_jwt()
def secure_get_resumes_by_matching_skills():
    return get_resumes_by_matching_skills()
@resume_ranking_bp.route("/rank-job/<job_id>",methods=["GET"])
def secure_get_resume_by_matching_jobID(job_id):
    return add_resume_ranking_for_job(job_id)