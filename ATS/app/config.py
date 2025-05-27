import os
from dotenv import load_dotenv

load_dotenv()
UPLOAD_FOLDER = "public/temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
    MONGO_URI = os.getenv("MONGO_URI")  
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_CLOUD_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_CLOUD_SECRET")
    FOLDER=UPLOAD_FOLDER
    API_KEY=os.getenv("API_KEY")

    if not MONGO_URI:
        raise ValueError("MONGO_URI is missing in environment variables!")
