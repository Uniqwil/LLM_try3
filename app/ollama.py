import httpx


def chat_with_ollama(message: str) -> str:
    response = httpx.post(
        "http://127.0.0.1:11434/api/chat",
        json={
            "model": "gemma3:12b",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "stream": False
        },
        timeout=120.0
    )

    data = response.json()

    return data["message"]["content"]
