from functools import wraps
import jwt
from flask import request, g
from app.utils.ApiError import ApiError  # Your custom ApiError class
from db.db import mongo
from bson import ObjectId
import os

SECRET_KEY = os.getenv("ACCESS_TOKEN_SECRET")


def get_bearer_token():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None


def verify_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            raise ApiError(401, "Unauthorized request. No Bearer token found.")

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = decoded.get("_id") or decoded.get("user_id")  # Depending on your token payload key
            if not user_id:
                raise ApiError(401, "Invalid token payload")

            user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0, "refresh_token": 0})
            if not user:
                raise ApiError(404, "User not found")
            
            # Attach user info to global Flask context for route handlers
            user["_id"] = str(user["_id"])  # Convert ObjectId to string for convenience
            g.user = user

            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            raise ApiError(401, "Token has expired")
        except jwt.InvalidTokenError:
            raise ApiError(401, "Invalid token")
        except Exception as e:
            raise ApiError(500, f"Internal server error: {str(e)}")

    return decorated_function


