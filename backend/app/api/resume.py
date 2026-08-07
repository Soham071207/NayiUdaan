from fastapi import APIRouter, UploadFile, File

from app.utils.pdf_reader import extract_text_from_pdf
from app.ai.resume_parser import ResumeParser
from app.services.ai_engine import AIEngine

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file)

    parser = ResumeParser(text)
    parsed = parser.extract_sections()

    engine = AIEngine()

    result = engine.analyze_resume(
        resume_text=text,
        detected_skills=parsed["skills"]
    )

    return {
        "success": True,
        "filename": file.filename,
        "data": result
    }