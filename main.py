from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str):
    # Это временный "умный" поиск. 
    # Он имитирует выдачу разных треков в зависимости от твоего запроса.
    # Скоро мы подключим сюда прямой парсер SoundCloud!
    tracks = [
        {
            "title": f"{q.capitalize()} - Remix 2024",
            "artist": "SoundCloud Artist",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            "title": f"{q.capitalize()} - Original Mix",
            "artist": "Pulse Vibe Studio",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        }
    ]
    return tracks

@app.get("/")
async def root():
    return {"message": "Pulse Vibe Server is Online"}
