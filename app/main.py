from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
from app.ollama import chat_with_ollama

app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
def root():
    return FileResponse("app/static/index.html")

@app.post("/api/chat")
def chat(message: dict):
    answer = chat_with_ollama(message["message"])
    return {"message": answer}


@app.get("/api/models")
def models():
    response = httpx.get("http://127.0.0.1:11434/api/tags")
    return response.json()
