from fastapi import APIRouter, UploadFile, File, HTTPException

from app.utils.pdf_reader import extract_text_from_pdf
from app.ai.resume_parser import ResumeParser
from app.services.ai_engine import AIEngine

router = APIRouter()


@router.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    print(f"Inside upload_resume! Filename: {file.filename}", flush=True)

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    text = extract_text_from_pdf(file)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from this PDF.")

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
