from app.ai.skill_extractor import SkillExtractor


class ResumeParser:

    def __init__(self, text: str):
        self.text = text
        self.skill_extractor = SkillExtractor()

    def clean_text(self):
        return self.text.strip()

    def extract_sections(self):

        cleaned_text = self.clean_text()
        word_count = len(cleaned_text.split())
        character_count = len(cleaned_text)

        skills = self.skill_extractor.extract_skills(cleaned_text)

        return {
    "summary": {
        "word_count": word_count,
        "character_count": character_count
    },
    "skills": skills,
    "experience": "",
    "education": "",
    "projects": "",
    "certifications": ""
}
