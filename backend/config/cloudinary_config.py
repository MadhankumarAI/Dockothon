import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
import os

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_video_to_cloudinary(file_path: str, folder: str = "patient_videos"):
    """Upload video file to Cloudinary"""
    try:
        upload_result = cloudinary.uploader.upload(
            file_path,
            resource_type="video",  # REMOVED DUPLICATE
            folder=folder,
            overwrite=True,
            chunk_size=6000000,  # 6MB chunks
            eager=[
                {"width": 640, "height": 360, "crop": "scale"}
            ]
        )
        return {
            "success": True,
            "url": upload_result["secure_url"],
            "public_id": upload_result["public_id"],
            "duration": upload_result.get("duration"),
            "format": upload_result.get("format"),
            "bytes": upload_result.get("bytes")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def upload_video_file(file_content: bytes, filename: str, folder: str = "patient_videos"):
    """Upload video from file content"""
    try:
        import tempfile
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=filename) as tmp_file:
            tmp_file.write(file_content)
            tmp_file_path = tmp_file.name
        
        # Upload to Cloudinary
        result = upload_video_to_cloudinary(tmp_file_path, folder)
        
        # Clean up temporary file
        os.unlink(tmp_file_path)
        
        return result
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def delete_from_cloudinary(public_id: str, resource_type: str = "video"):
    """Delete file from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return result.get("result") == "ok"
    except Exception as e:
        print(f"Error deleting from Cloudinary: {e}")
        return False