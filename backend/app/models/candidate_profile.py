from pydantic import BaseModel
from typing import List


class Education(BaseModel):
    degree: str
    major: str


class Project(BaseModel):
    name: str


class Certification(BaseModel):
    name: str


class Candidate(BaseModel):
    name: str
    previous_role: str
    experience_years: int
    career_gap_years: int = 0
    career_gap_reason: str = ""
    education: List[Education]


class Skills(BaseModel):
    detected: List[str]
    strong: List[str] = []
    missing: List[str] = []
    priority: List[str] = []


class Market(BaseModel):
    required_skills: List[str] = []
    readiness_score: int = 0
    reason: str = ""


class CareerPlan(BaseModel):
    recommended_role: str = ""
    confidence: int = 0
    estimated_return_time: str = ""
    alternate_roles: List[str] = []
    reason: str = ""


class CandidateProfile(BaseModel):

    candidate: Candidate

    skills: Skills

    projects: List[Project] = []

    certifications: List[Certification] = []

    market: Market = Market()

    career_plan: CareerPlan = CareerPlan()