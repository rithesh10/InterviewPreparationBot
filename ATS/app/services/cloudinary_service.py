import cloudinary
import cloudinary.uploader
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "public/temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_CLOUD_KEY"),
    api_secret=os.getenv("CLOUDINARY_CLOUD_SECRET")
)

def upload_to_cloudinary(file):
    """
    Uploads a PDF file to Cloudinary and returns a working URL.
    """
    try:
        if not file:
            return None

        filename = secure_filename(file.filename)
        public_id = filename.rsplit(".", 1)[0]  
        upload_result = cloudinary.uploader.upload(
            file,
            resource_type="raw",  
            folder="resumes",  
            public_id=public_id,
            format="pdf" 
        )

        cloudinary_url = upload_result.get("secure_url")
        if not cloudinary_url:
            raise Exception("Upload failed, secure_url missing.")

        download_url = f"{cloudinary_url}?fl_attachment=true"

        print("✅ File uploaded successfully:", download_url)
        return download_url

    except Exception as e:
        print("❌ Cloudinary Upload Failed:", str(e))
        return None