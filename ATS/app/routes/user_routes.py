from flask import Blueprint, request,json
from ..controllers.user_controller import login_user, update_profile,register_user,get_user,get_all_users ,update_user,delete_user
from app.middleware.auth_middleware import verify_jwt
from app.utils.ApiError import ApiError
user_bp = Blueprint("users", __name__)
@user_bp.errorhandler(ApiError)
def handle_api_error(error):
    """Handle custom API errors and return JSON response."""
    response = jsonify(error.to_dict())  # Convert the error object to a dictionary
    response.status_code = error.status_code  # Set the status code from the error
    return response

@user_bp.route("/profile", methods=["GET"])
def profile():
    return "Hello"  # Calls function from user_controller.py

@user_bp.route("/profile/update", methods=["POST"])
def profile_update():
    data = request.get_json()
    return update_profile(data)  # Calls function from user_controller.py

@user_bp.route("/register",methods=["POST"])
def register():
    data=request.get_json()
    return register_user(data)

@user_bp.route("/login",methods=["POST"])
def login():
    data=request.get_json()
    return login_user(data)

@user_bp.route("/<id>",methods=["GET"])
@verify_jwt
def getUser(id):
    print("hello")
    return get_user(id)

@user_bp.route("/",methods=["GET"])
@verify_jwt
def getAllUsers():
    return get_all_users();

@user_bp.route("/<id>",methods=["PUT"])
@verify_jwt
def updateUser(id):
    data=request.get_json()
    return update_user(id,data)

@user_bp.route("/<id>",methods=["DELETE"])
@verify_jwt

def deleteUser(id):
    return delete_user(id)