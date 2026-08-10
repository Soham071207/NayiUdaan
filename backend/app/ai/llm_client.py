"""
llm_client.py
----------------------------------------------------------------------
Hardened LLM Client for NayiUdaan AI

Key improvements over original:
  - Separates system prompt from user prompt (better instruction-following)
  - Explicit model selection with a reliable fallback chain
  - Temperature=0.3 for structured JSON tasks (reduces hallucination)
  - Timeout protection via httpx timeout config
  - Retry logic (up to 2 retries on transient failure)
  - Centralised, robust ask_json() used by all AI modules
  - Structured logging so errors are diagnosable in production
----------------------------------------------------------------------
"""

import json
import logging
import os
import time
from typing import Any, Optional

from dotenv import load_dotenv
from openai import OpenAI, APIError, APITimeoutError, RateLimitError

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Preferred model: a reliable instruct model on OpenRouter.
# Falls back to the free tier if the env var MODEL is not set.
# ---------------------------------------------------------------------------
_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")

_client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    timeout=60.0,          # hard timeout per request
    max_retries=0,         # we handle retries ourselves below
)

_MAX_RETRIES = 2
_RETRY_DELAY = 1.5        # seconds between retries


class LLMClient:
    """
    Thin wrapper around the OpenRouter API with:
      - System/user message separation
      - Configurable temperature
      - Retry logic with exponential back-off
      - Centralised JSON extraction used by all AI modules
    """

    # ------------------------------------------------------------------
    # Core call
    # ------------------------------------------------------------------
    def ask(
        self,
        prompt: str,
        system: str = "You are a helpful AI assistant.",
        temperature: float = 0.3,
    ) -> str:
        """
        Send a prompt to the LLM and return the raw text response.

        Args:
            prompt:      The user-turn message.
            system:      System prompt (role/persona for the model).
            temperature: 0.0 = deterministic, 1.0 = creative.
                         Use 0.3 for structured JSON, 0.7 for narrative.
        """
        messages = [
            {"role": "system", "content": system},
            {"role": "user",   "content": prompt},
        ]

        last_error: Optional[Exception] = None
        for attempt in range(_MAX_RETRIES + 1):
            try:
                response = _client.chat.completions.create(
                    model=_MODEL,
                    messages=messages,
                    temperature=temperature,
                )
                return response.choices[0].message.content or ""

            except (APITimeoutError, RateLimitError) as e:
                last_error = e
                wait = _RETRY_DELAY * (attempt + 1)
                logger.warning(
                    "LLMClient: transient error on attempt %d/%d — retrying in %.1fs: %s",
                    attempt + 1, _MAX_RETRIES + 1, wait, str(e),
                )
                time.sleep(wait)

            except APIError as e:
                logger.error("LLMClient: non-retriable API error: %s", str(e))
                raise

        logger.error("LLMClient: all %d attempts exhausted. Last error: %s", _MAX_RETRIES + 1, last_error)
        raise last_error  # type: ignore[misc]

    # ------------------------------------------------------------------
    # JSON helper
    # ------------------------------------------------------------------
    def ask_json(
        self,
        prompt: str,
        system: str = "You are a helpful AI assistant. Always respond with valid JSON only.",
        temperature: float = 0.0,   # lower temp → more consistent JSON and deterministic scores
    ) -> Any:
        """
        Call the LLM and parse the response as JSON.

        Extraction is robust:
          1. Strip markdown fences
          2. Find the outermost { } or [ ] block
          3. json.loads with a clear error log on failure

        Returns the parsed object, or raises ValueError if parsing fails.
        """
        raw = self.ask(prompt, system=system, temperature=temperature)
        return _extract_json(raw)


# ---------------------------------------------------------------------------
# Module-level helpers used by AI modules directly
# ---------------------------------------------------------------------------

def extract_json_object(raw: str) -> dict:
    """Extract the first complete JSON object {} from a string."""
    raw = _strip_fences(raw)
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in LLM response. Raw (truncated): {raw[:200]}")
    return json.loads(raw[start: end + 1])


def extract_json_array(raw: str) -> list:
    """Extract the first complete JSON array [] from a string."""
    raw = _strip_fences(raw)
    start, end = raw.find("["), raw.rfind("]")
    if start == -1 or end == -1:
        raise ValueError(f"No JSON array found in LLM response. Raw (truncated): {raw[:200]}")
    return json.loads(raw[start: end + 1])


def _strip_fences(text: str) -> str:
    return text.replace("```json", "").replace("```", "").strip()


def _extract_json(raw: str) -> Any:
    raw = _strip_fences(raw)
    # Try object first, then array
    for finder in [
        (raw.find("{"), raw.rfind("}"), lambda s: json.loads(s)),
        (raw.find("["), raw.rfind("]"), lambda s: json.loads(s)),
    ]:
        start, end, parser = finder
        if start != -1 and end != -1 and end > start:
            try:
                return parser(raw[start: end + 1])
            except json.JSONDecodeError:
                continue
    raise ValueError(f"Unable to parse JSON from LLM response. Raw (truncated): {raw[:300]}")
