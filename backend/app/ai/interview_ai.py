"""
AI layer for the Mock Interview Engine.

This is the ONLY module that talks to the LLM (via OpenRouter) for
interview-related reasoning. Routes and services never call the LLM
directly — they call functions here, which always return validated,
predictable data (never raw LLM text) or raise InterviewAIError.
"""

from typing import List, Optional

from app.schemas.interview import (
    AnswerEvaluation,
    CandidateContext,
    InterviewType,
)
from app.ai.async_llm_client import call_llm_json, LLMClientError


class InterviewAIError(Exception):
    """Raised when the AI layer cannot produce a usable structured result."""


async def _call_llm(system_prompt: str, user_prompt: str) -> dict:
    try:
        return await call_llm_json(system_prompt, user_prompt)
    except LLMClientError as exc:
        raise InterviewAIError(str(exc)) from exc


def _context_block(context: Optional[CandidateContext]) -> str:
    if not context:
        return "No additional candidate context is available."
    parts = []
    if context.field:
        parts.append(f"Industry/Field: {context.field}")
    if context.previous_role:
        parts.append(f"Previous role: {context.previous_role}")
    if context.experience_years is not None:
        parts.append(f"Experience: {context.experience_years} years")
    if context.career_gap:
        gap_years = context.gap_years if context.gap_years is not None else "unspecified"
        parts.append(f"Career gap: yes, approx. {gap_years} years")
    if context.target_role:
        parts.append(f"Target role: {context.target_role}")
    return "\n".join(parts) if parts else "No additional candidate context is available."


async def generate_question(
    target_role: str,
    interview_type: InterviewType,
    question_number: int,
    total_questions: int,
    candidate_context: Optional[CandidateContext],
    previous_qa: List[dict],
    field: Optional[str] = None,
) -> str:
    """Generate the next interview question. Returns plain question text."""

    field_context = f" in the {field} industry" if field else ""
    field_tools_note = (
        f" For the {field} field specifically, reference domain-standard tools, workflows, regulations, and terminology typical of {field} professionals."
        if field else ""
    )

    system_prompt = (
        f"You are a senior hiring manager and domain expert who specializes in hiring for the role of '{target_role}'{field_context}. "
        "You are conducting a structured interview for NayiUdaan, a platform that helps women return to the workforce. "
        "Your job is to generate ONE highly specific, realistic interview question per turn. "
        "\n\nCRITICAL RULES:"
        "\n- Questions MUST be directly tied to the day-to-day tools, techniques, decisions, and challenges of the EXACT target role."
        f"{field_tools_note}"
        "\n- NEVER ask generic questions like 'tell me about yourself' or 'what are your strengths/weaknesses' unless it's the first question in a career_return interview."
        "\n- For TECHNICAL questions: ask about specific tools, frameworks, algorithms, or methodologies the role requires (e.g. for Data Analyst: SQL window functions, pandas, Tableau; for Product Manager: PRD writing, OKRs, user story mapping; for Software Engineer: system design, time complexity, design patterns)."
        "\n- For BEHAVIORAL questions: ground them in realistic workplace scenarios for THAT specific role (e.g. 'Walk me through a time you had to reconcile mismatched data from two sources in your pipeline' for a Data Analyst)."
        "\n- For CAREER_RETURN questions: focus on how the candidate's gap is relevant to the role — how they kept skills current, what changed in the field during their break, and how they plan to ramp up quickly."
        "\n- Follow question PROGRESSION: Q1 should be a role-specific warm-up, middle questions should be core domain/scenario-based, final questions should be reflection or tricky edge-cases."
        "\n- Do NOT repeat a question already asked."
        '\n\nRespond ONLY with a JSON object: {"question": "..."}. No preamble, no markdown.'
    )

    history_block = ""
    if previous_qa:
        history_lines = [
            f"Q{i + 1}: {qa['question']}\nA{i + 1}: {qa['answer']}"
            for i, qa in enumerate(previous_qa)
        ]
        history_block = "Previous Q&A in this session:\n" + "\n\n".join(history_lines)

    user_prompt = f"""
Target role: {target_role}{field_context}
Interview type: {interview_type.value}
This is question {question_number} of {total_questions}.

Candidate context:
{_context_block(candidate_context)}

{history_block}

Generate the next field-specific interview question for a {target_role}{field_context}. 
The question must require knowledge, judgment, or experience that ONLY someone who has worked in this specific role{field_context} would have.
""".strip()

    result = await _call_llm(system_prompt, user_prompt)
    question = result.get("question")
    if not question:
        raise InterviewAIError("AI did not return a 'question' field")
    return question


async def evaluate_answer(
    target_role: str,
    interview_type: InterviewType,
    question: str,
    answer: str,
    candidate_context: Optional[CandidateContext],
    field: Optional[str] = None,
) -> AnswerEvaluation:
    """Evaluate a candidate's answer against structured criteria."""

    field_context = f" in the {field} industry" if field else ""

    system_prompt = (
        f"You are a senior domain expert and hiring evaluator specializing in '{target_role}' roles{field_context}. "
        "You assess interview answers with the eye of someone who has WORKED in this field for 10+ years. "
        "Your scoring reflects what a real interviewer at a top company in this domain would expect. "
        "\n\nSCORING GUIDE:"
        "\n- overall_score: Holistic quality of this answer for the target role (0-100)."
        "\n- communication: Clarity, structure, and professional language (0-100)."
        f"\n- technical_accuracy: Correctness of domain-specific facts, tools, or methodology mentioned{field_context}. "
        "For pure behavioral/gap questions, score how factually sound and credible the content is (0-100)."
        "\n- relevance: How directly this answer addresses the question from the perspective of THIS role (0-100)."
        "\n- structure: Use of frameworks (STAR, PREP, etc.), logical flow (0-100)."
        "\n- confidence: Tone, ownership of experience, absence of hedging (0-100)."
        "\n- strengths: 2-3 specific things done well (cite actual content from the answer)."
        "\n- weaknesses: 2-3 specific things missing or incorrect (be constructive, not harsh)."
        f"\n- feedback: 2-3 sentence expert coaching note referencing the SPECIFIC domain{field_context} (name real tools/concepts)."
        f"\n- improved_answer: A full, example-quality answer that a strong candidate for THIS EXACT ROLE{field_context} would give."
        "\n\nRespond ONLY with a valid JSON object matching the schema above. No preamble, no markdown."
    )

    user_prompt = f"""
Target role: {target_role}{field_context}
Interview type: {interview_type.value}

Candidate context:
{_context_block(candidate_context)}

Question asked:
{question}

Candidate's answer:
{answer}

Evaluate this answer as a domain expert in {target_role}{field_context}. 
Reference specific skills, tools, or best practices relevant to this role{field_context} when giving feedback and writing the improved answer.
For 'career_return' type: also weight honesty, confidence, and clear framing of the gap.
""".strip()

    result = await _call_llm(system_prompt, user_prompt)
    try:
        return AnswerEvaluation(**result)
    except Exception as exc:
        raise InterviewAIError(f"AI evaluation did not match schema: {exc}") from exc
