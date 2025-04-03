from flask_pymongo import PyMongo

mongo = PyMongo()  # Create a global MongoDB instance
import os
from dotenv import load_dotenv

load_dotenv()
def init_mongo(app):
    """Initialize MongoDB connection."""
    print(os.getenv("MONGO_URI"))
    print(app.config.get("MONGO_URI"))
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")  # Ensure MongoDB URI is set
    mongo.init_app(app)  # Bind MongoDB to Flask app

    try:
        # Test connection
        mongo.db.command("ping")
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")
