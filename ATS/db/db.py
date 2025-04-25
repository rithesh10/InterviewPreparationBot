from flask_pymongo import PyMongo
from flask_session import Session
mongo = PyMongo()  # Create a global MongoDB instance
import os
from dotenv import load_dotenv

load_dotenv()
def init_mongo(app):
    """Initialize MongoDB connection."""
    print(os.getenv("MONGO_URI"))
    print(app.config.get("MONGO_URI"))
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")  # Ensure MongoDB URI is set
    mongo.init_app(app)  # Bind MongoDB to Flask app
    Session(app)
    app.secret_key = os.getenv("SECRET_KEY")

    try:
        # Test connection
        mongo.db.command("ping")
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")
