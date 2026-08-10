"""
Shared OpenRouter client for the career_coach module.

Every AI submodule (interview_ai, gap_coach_ai, future feedback_ai, etc.)
calls through here instead of talking to OpenRouter directly. This is the
one place that owns the HTTP call, auth, and JSON-mode enforcement, so
individual AI modules stay focused on their own prompts.
"""

import json
import os

import httpx

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
DEFAULT_MODEL = os.environ.get("INTERVIEW_MODEL", "openai/gpt-4o-mini")


class LLMClientError(Exception):
    """Raised when the LLM call fails or returns something unusable."""


async def call_llm_json(system_prompt: str, user_prompt: str, model: str = DEFAULT_MODEL) -> dict:
    """
    Calls the LLM with JSON-mode enforced and returns the parsed dict.
    Raises LLMClientError on any failure (missing key, network error,
    malformed JSON) so callers only need to catch one exception type.
    """
    if not OPENROUTER_API_KEY:
        raise LLMClientError("OPENROUTER_API_KEY is not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.4,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(OPENROUTER_API_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

    try:
        raw_text = data["choices"][0]["message"]["content"]
        return json.loads(raw_text)
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        raise LLMClientError(f"Malformed AI response: {exc}") from exc
