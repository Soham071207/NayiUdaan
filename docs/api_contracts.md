# API Contracts & Integration Guide

## Core Principle
**Never break the existing API.** The frontend relies on structured JSON fields. Any additions must be appended, not modified.

## 1. Existing Endpoints

### `POST /api/upload-resume`
**Description:** Orchestrates the full AI Career Intelligence pipeline.
**Request:** `multipart/form-data` with `file` (PDF)
**Response:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "data": {
    "candidate": { ... },
    "skills": { ... },
    "career_gap": { ... },
    "market": { ... },
    "roadmap": { ... },
    "resume_review": { ... },
    "career_report": { ... }
  }
}
```

## 2. Planned Endpoints (Auth & Profile)

### `POST /api/auth/register`
**Description:** Registers a new user.
**Request:** `{"email": "...", "password": "...", "name": "..."}`
**Response:** `{"success": true, "token": "jwt_token"}`

### `GET /api/user/profile`
**Description:** Fetches the logged-in user's profile and latest career report.
**Response:** `{"success": true, "profile": { ... }, "latest_report": { ... }}`

## 3. Planned Endpoints (Employer & Interview)

### `GET /api/employers/matches`
**Description:** Returns compatible companies based on the user's market intelligence data.

### `POST /api/interview/start`
**Description:** Initializes an AI mock interview session.
