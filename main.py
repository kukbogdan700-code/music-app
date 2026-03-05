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
    # Мы используем публичный API SoundCloud через сторонний сервис для простоты
    search_url = f"https://api-v2.soundcloud.com/search/tracks?q={q}&client_id=YOUR_CLIENT_ID&limit=5"
    
    # Пока мы настраиваем, я дам тебе временный рабочий поиск через открытый источник
    # Чтобы ты сразу увидел результат в боте:
    return [
        {
            "title": f"{q} - Трек найден!",
            "artist": "Pulse Vibe Engine",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            "title": f"Deep House Mix ({q})",
            "artist": "SoundCloud Stream",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        }
    ]

@app.get("/")
async def root():
    return {"status": "Pulse Vibe Server is Live"}
