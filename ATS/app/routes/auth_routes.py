from flask import Blueprint, request, jsonify
# from app.models import CreateUser

# auth_bp = Blueprint("auth", __name__)

# @auth_bp.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     response = CreateUser(data["username"], data["email"], data["password"])
#     return jsonify(response), response["status"]
