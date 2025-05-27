from flask import Flask, Blueprint, request, jsonify
from app.middleware.auth_middleware import verify_jwt
from app.controllers.gemini_controllers import start_interview, answer_question,summary_of_text,calculate_score,get_calculated_score

gemini_bp = Blueprint("gemini", __name__)

@gemini_bp.route("/start_interview_session", methods=["POST"])
@verify_jwt
def start_interview_session():
    return start_interview()

@gemini_bp.route("/answer_interview_question", methods=["POST"])
@verify_jwt
def answer_interview_question():
    return answer_question()

@gemini_bp.route("/summary-data",methods=["POST"])
def summarizer():
    return summary_of_text()

@gemini_bp.route("/calculate-scores/<id>",methods=["GET"])
@verify_jwt
def calculate(id):
    return calculate_score(id)

@gemini_bp.route("get-calculated-score/<id>",methods=["GET"])
@verify_jwt
def getCalculatedScore(id):
    return get_calculated_score(id)