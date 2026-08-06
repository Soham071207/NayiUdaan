from fastapi import APIRouter, UploadFile, File

from app.utils.pdf_reader import extract_text_from_pdf
from app.ai.resume_parser import ResumeParser
from app.ai.resume_intelligence import ResumeIntelligence

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    # Extract text
    text = extract_text_from_pdf(file)

    # Skill Extraction
    parser = ResumeParser(text)
    parsed_data = parser.extract_sections()

    # AI Resume Intelligence
    ai = ResumeIntelligence()
    candidate_data = ai.analyze_resume(text)

    return {
        "status": "success",
        "filename": file.filename,
        "candidate": candidate_data,
        "skills": parsed_data["skills"]
    }