import httpx


def chat_with_ollama(messages: list, model: str) -> dict:
    response = httpx.post(
        "http://127.0.0.1:11434/api/chat",
        json={
            "model": model,
            "messages": messages,
            "stream": False
        },
        timeout=120.0
    )

    data = response.json()

    generated_tokens = data.get("eval_count", 0)
    generation_time_ns = data.get("eval_duration", 0)
    total_time_ns = data.get("total_duration", 0)

    generation_time = generation_time_ns / 1_000_000_000
    total_time = total_time_ns / 1_000_000_000

    tokens_per_second = 0

    if generation_time > 0:
        tokens_per_second = generated_tokens / generation_time

    system_prompt = any(
        message["role"] == "system"
        for message in messages
    )

    return {
        "content": data["message"]["content"],
        "model": data["model"],
        "prompt_tokens": data.get("prompt_eval_count", 0),
        "generated_tokens": generated_tokens,
        "generation_time": generation_time,
        "tokens_per_second": tokens_per_second,
        "total_time": total_time,
        "system_prompt": system_prompt
    }
    #
    # return {
    #     "content": data["message"]["content"],
    #     "model": data["model"],
    #     "prompt_tokens": data.get("prompt_eval_count", 0),
    #     "generated_tokens": data.get("eval_count", 0),
    #     "generation_time_ns": data.get("eval_duration", 0),
    #     "total_time_ns": data.get("total_duration", 0)
    # }

    # return data["message"]["content"]
