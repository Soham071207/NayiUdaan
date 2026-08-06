from app.ai.gemini_client import GeminiClient

client = GeminiClient()

response = client.ask(
    "Reply with exactly: Hello NayiUdaan!"
)

print(response)