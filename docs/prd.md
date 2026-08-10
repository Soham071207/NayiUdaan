# Product Requirements Document (PRD): NayiUdaan

## 1. Executive Summary
**NayiUdaan** is an AI-powered career comeback platform designed exclusively for women looking to re-enter the workforce after career breaks (due to maternity, caregiving, relocation, etc.). 
Unlike standard job portals, NayiUdaan provides deep, personalized AI-driven career analysis, upskilling roadmaps, resume optimization, and employer compatibility matching to bridge the gap between their past experience and current market demands.

## 2. Target Audience
- Women with 1+ years of prior professional experience.
- Currently on a career break (6 months to 10+ years).
- Seeking structured guidance, confidence building, and returnship/full-time opportunities.

## 3. Core Features & Capabilities

### 3.1. AI Career Intelligence (Core Engine)
- **Resume Parsing & Intelligence**: Extracts candidate history, education, and skills.
- **Career Gap Detector**: Analyzes the duration and context of career gaps, identifying transferable skills.
- **Market Intelligence**: Compares existing skills against current market demands and calculates a "Career Readiness Score".
- **AI Roadmap Generator**: Creates a personalized, 8-week upskilling and recovery roadmap.
- **Resume Optimizer**: Provides ATS scoring, keyword suggestions, and professional summary rewrites.
- **Career Report**: Consolidates all AI reasoning into a single executive dashboard report.

### 3.2. Employer Intelligence (Upcoming)
- **Employer Matching**: Matches candidates with companies that offer returnship programs or have inclusive hiring policies.
- **Company Compatibility**: AI-driven alignment score between candidate values/needs and company culture.

### 3.3. Career Coach (Upcoming)
- **Interview Preparation**: AI mock interviews and behavioral question coaching.
- **Learning Tracker**: Progress tracking for the 8-week AI roadmap.

## 4. User Interface (UI) Requirements
The platform will consist of the following primary views, prioritizing a premium, dynamic, and empathetic design language:
1. **Landing Page**: Value proposition, success stories, and call-to-action.
2. **Dashboard**: Central hub for the Career Report, Roadmap progress, and notifications.
3. **Resume Upload Page**: Drag-and-drop interface with loading states for the AI Engine orchestration.
4. **Roadmap Page**: Interactive 8-week timeline with checkable milestones.
5. **Employer Page**: Curated list of compatible companies and returnship opportunities.
6. **Interview Page**: Interactive AI coaching interface for interview prep.

## 5. Backend & Technical Requirements
- **Authentication**: Secure user login/signup (JWT-based).
- **User Profile Management**: Persistent storage of candidate data, uploaded resumes, and generated reports.
- **Database**: Relational database (e.g., PostgreSQL) for user and employer records.
- **API Integration**: RESTful API design ensuring loose coupling between the React frontend and FastAPI backend.

## 6. Success Metrics
- **User Engagement**: Completion rate of the 8-week roadmap.
- **System Accuracy**: Quality and relevance of AI market intelligence and employer matches.
- **Performance**: API response times under 5 seconds for full AI orchestration.
