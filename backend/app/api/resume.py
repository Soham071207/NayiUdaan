from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    return {
        "status": "success",
        "filename": file.filename,
        "content_type": file.content_type
    }