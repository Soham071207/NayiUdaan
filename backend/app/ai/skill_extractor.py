import json
from pathlib import Path


class SkillExtractor:

    def __init__(self):
        dataset_path = Path(__file__).parent.parent / "datasets" / "skills.json"

        with open(dataset_path, "r") as f:
            self.skills = json.load(f)

    def extract_skills(self, text: str):

        found_skills = []

        text_lower = text.lower()

        for skill in self.skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)

        return sorted(list(set(found_skills)))