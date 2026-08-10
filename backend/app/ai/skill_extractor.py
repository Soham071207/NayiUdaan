import json
from pathlib import Path


class SkillExtractor:

    def __init__(self):
        dataset_path = Path(__file__).parent.parent / "datasets" / "skills.json"

        with open(dataset_path, "r") as f:
            self.skills = json.load(f)

        # Pre-compute lowercase lookup set for O(1) matching
        self._skills_lower = {s.lower(): s for s in self.skills}

    def extract_skills(self, text: str):
        text_lower = text.lower()

        # Use set comprehension for deduplication + O(1) lookup
        found = {
            original
            for lower, original in self._skills_lower.items()
            if lower in text_lower
        }

        return sorted(found)
