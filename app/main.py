from fastapi import FastAPI
from fastapi.responses import FileResponse
import httpx

app = FastAPI()


@app.get("/")
def root():
    return FileResponse("app/static/index.html")

@app.post("/api/chat")
def chat(message: dict):
    return {"message": message["message"]}


@app.get("/api/models")
def models():
    response = httpx.get("http://127.0.0.1:11434/api/tags")
    return response.json()
