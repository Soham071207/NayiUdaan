from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_reader import extract_text_from_pdf
from app.ai.resume_parser import ResumeParser

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file)

    parser = ResumeParser(text)

    result = parser.extract_sections()

    return {
        "status": "success",
        "filename": file.filename,
        "data": result
    }