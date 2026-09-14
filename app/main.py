from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
from app.ollama import chat_with_ollama

app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")

conversation=[]


@app.get("/")
def root():
    return FileResponse("app/static/index.html")

@app.post("/api/chat")
def chat(message: dict):

    conversation.append({
        "role": "user",
        "content": message["message"]
    })

    ollama_response = chat_with_ollama(
        conversation,
        message["model"]
    )

    answer = ollama_response["content"]

    conversation.append({
        "role": "assistant",
        "content": answer
    })

    return {
        "message": answer,
        "stats": {
            "model": ollama_response["model"],
            "prompt_tokens": ollama_response["prompt_tokens"],
            "generated_tokens": ollama_response["generated_tokens"],
            "generation_time": ollama_response["generation_time"],
            "tokens_per_second": ollama_response["tokens_per_second"],
            "total_time": ollama_response["total_time"],
            "system_prompt": ollama_response["system_prompt"]
            }
        }


@app.get("/api/models")
def models():
    response = httpx.get("http://127.0.0.1:11434/api/tags")
    return response.json()
