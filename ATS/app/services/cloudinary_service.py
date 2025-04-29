import cloudinary
import cloudinary.uploader
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "public/temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Configure Cloudinary (Ensure your .env has correct credentials)
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

        # ✅ Secure the filename
        filename = secure_filename(file.filename)
        public_id = filename.rsplit(".", 1)[0]  # Remove file extension

        # ✅ Upload to Cloudinary as 'raw' resource type
        upload_result = cloudinary.uploader.upload(
            file,
            resource_type="raw",  # Required for PDFs
            folder="resumes",  # Store inside 'resumes' folder
            public_id=public_id,  # Unique file ID
            format="pdf"  # Ensure it's stored as a PDF
        )

        # ✅ Extract correct URL
        cloudinary_url = upload_result.get("secure_url")
        if not cloudinary_url:
            raise Exception("Upload failed, secure_url missing.")

        # ✅ Force Download (Optional)
        download_url = f"{cloudinary_url}?fl_attachment=true"

        print("✅ File uploaded successfully:", download_url)
        return download_url  # Use this in your frontend/backend

    except Exception as e:
        print("❌ Cloudinary Upload Failed:", str(e))
        return None
