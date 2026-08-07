import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


class LLMClient:

    def ask(self, prompt: str):

        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    def ask_json(self, prompt: str):

        response = self.ask(prompt)

        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        try:
            return json.loads(response)

        except json.JSONDecodeError:
            return {
                "error": "Invalid JSON returned by LLM",
                "raw_response": response
            }