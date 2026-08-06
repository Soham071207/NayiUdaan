from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_reader import extract_text_from_pdf

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file)

    return {
        "status": "success",
        "filename": file.filename,
        "text": text
    }