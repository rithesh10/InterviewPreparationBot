from werkzeug.security import generate_password_hash,check_password_hash
from datetime import datetime,timedelta,timezone
from pymongo import errors
from app.models.user_model import UserSchema  # Import your UserSchema
from flask import jsonify,make_response
from db.db import mongo
from bcrypt import gensalt, hashpw, checkpw
from bson import ObjectId,json_util
import traceback  # For debugging exceptions
from datetime import datetime
import os
import jwt
from app.middleware.auth_middleware import verify_jwt

ACCESS_TOKEN_OPTIONS = {
    "httponly": True,
    "secure": True,
    # "samesite": "Strict",
    # "max_age": 3600  # 1 hour expiry
}

REFRESH_TOKEN_OPTIONS = {
    "httponly": True,
    "secure": True,
    # "samesite": "Strict",
    # "max_age": 604800  # 7 days expiry
}
def get_profile():
    """Fetch user profile data (Example: Placeholder Response)"""
    return jsonify({"message": "User profile data"}), 200

def update_profile(data):
    """Update user profile (Example: Placeholder Response)"""
    return jsonify({"message": f"Profile updated with {data}"}), 200


def register_user(data):
    """Registers a new user in the database"""
    try:
        # Validate input data using Marshmallow schema
        schema = UserSchema()
        errors = schema.validate(data)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        email = data["email"]

        # Check if email already exists
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400

        # Hash the password
        hashed_password = generate_password_hash(data["password"])

        # Prepare user data
        user_data = {
            "full_name": data.get("full_name"),
            "email": email,
            "password": hashed_password,
            "refresh_token": None,  # Refresh token will be set after login
            "role": data.get("role", "user"),  # Default role is "user"
            "phone": data.get("phone"),
            "resumes": [],  # Default empty list
            "created_at": datetime.now()
        }

        # Insert user into MongoDB
        mongo.db.users.insert_one(user_data)

        return jsonify({"message": "User registered successfully"}), 201

    except errors.PyMongoError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


def generate_access_refresh_token(user_id):
    """
    Calls `generate_access_token()` and `generate_refresh_token()`,
    updates refresh token in DB, and returns both tokens.
    """
    access_token = generate_access_token(user_id)
    refresh_token = generate_refresh_token(user_id)

    if access_token and refresh_token:
        try:
            result = mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},  # Convert user_id to ObjectId
                {"$set": {"refresh_token": refresh_token}}
            )

            # Debugging: Check if MongoDB updated any document
            if result.matched_count == 0:
                print("❌ No matching user found in DB")
            elif result.modified_count == 0:
                print("⚠ Refresh token was already up to date")
            else:
                print("✅ Refresh token updated successfully")

        except Exception as e:
            print(f"🔥 MongoDB Update Error: {e}")

    return access_token, refresh_token

def login_user(data):
    """Logs in the user and generates tokens"""
    try:
        print(data)

        # Check required fields
        required_fields = ["email", "password"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        email, password = data["email"], data["password"]
        existing_user = mongo.db.users.find_one({"email": email})

        if not existing_user:
            return jsonify({"error": "Invalid credentials"}), 400  # Generic error message

        # Validate password
        if not check_password_hash(existing_user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 400

        # Remove sensitive fields before further processing
        existing_user.pop("password", None)
        existing_user["_id"] = str(existing_user["_id"])  # Convert ObjectId to string

        # Generate tokens
        access_token, refresh_token = generate_access_refresh_token(existing_user["_id"])

        if not access_token or not refresh_token:
            return jsonify({"error": "Token generation failed"}), 500

        # Store refresh token in the database
        mongo.db.users.update_one(
            {"_id": ObjectId(existing_user["_id"])},  # Fix: Convert back to ObjectId
            {"$set": {"refresh_token": refresh_token}}
        )

        # Create response
        response = make_response(jsonify({
            "message": "User logged in successfully",
            "user": json_util.loads(json_util.dumps(existing_user))  # Ensure JSON serialization
        }), 200)

        # Set Secure & HttpOnly Cookies
        response.set_cookie("accessToken", access_token, httponly=True, secure=True, samesite="None")
        response.set_cookie("refreshToken", refresh_token, httponly=True, secure=True, samesite="None")

        return response

    except Exception as e:
        print(e)
        traceback.print_exc()  # Log full traceback for debugging
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def get_user(id):
    """Get user details by ID"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid user ID format"}), 400

        user = mongo.db.users.find_one({"_id": ObjectId(id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Remove sensitive data
        user.pop("password", None)
        user["_id"] = str(user["_id"])

        return jsonify({"message": "User fetched successfully", "user": user}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred"}), 500
def get_all_users():
    try:
        # Fetch all users from MongoDB
        users = list(mongo.db.users.find({}, {"password": 0}))  # Exclude passwords for security

        if not users:
            return jsonify({"message": "No users found"}), 404

        # Convert ObjectId to string
        for user in users:
            user["_id"] = str(user["_id"])

        return jsonify({"message": "Users fetched successfully", "users": users}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def update_user(user_id, data):
    """Updates user details in the database"""
    try:
        # Allowed fields to update
        allowed_fields = ["username", "email", "password"]
        update_data = {field: data[field] for field in allowed_fields if field in data}


        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400

        # Check if email is being updated and if it already exists
        if "email" in update_data:
            existing_user = mongo.db.users.find_one({"email": update_data["email"], "_id": {"$ne": ObjectId(user_id)}})
            if existing_user:
                return jsonify({"error": "Email is already in use"}), 400

        # Hash password if updating
        if "password" in update_data:
            update_data["password"] = hashpw(update_data["password"].encode('utf-8'), gensalt()).decode('utf-8')

        # Update user in MongoDB
        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
def delete_user(user_id):
    """Delete a user from the database by ID"""
    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
def generate_access_token(user_id):
    """Generates an access token for the user"""
    try:
        # print(user_id)
        payload = {
            "user_id": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(days=1),  # Token expires in 15 mins
            "iat": datetime.now(timezone.utc)
        }
        token= jwt.encode(payload, os.getenv("ACCESS_TOKEN_SECRET"), algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        return token
    except Exception as e:
        print(f"Error generating access token: {e}")
        return None

def generate_refresh_token(user_id):
    """Generates a refresh token for the user"""
    try:
        payload = {
            "user_id": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(days=7),  # Token expires in 7 days
            "iat": datetime.now(timezone.utc)
        }
        token= jwt.encode(payload, os.getenv("REFRESH_TOKEN_SECRET"), algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        return token
    except Exception as e:
        print(f"Error generating refresh token: {e}")
        return None