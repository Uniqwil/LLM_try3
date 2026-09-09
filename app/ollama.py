import httpx


def chat_with_ollama(message: str) -> str:
    response = httpx.post(
        "http://127.0.0.1:11434/api/chat",
        json={
            "model": "qwen3:14b-q4_K_M",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "stream": False
        }
    )

    data = response.json()

    return data["message"]["content"]
