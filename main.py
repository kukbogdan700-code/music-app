from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Это разрешает вашему сайту на GitHub общаться с этим сервером
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str):
    # Пока это "заглушка", но скоро здесь будет реальный поиск SoundCloud
    return [
        {
            "title": f"Результат для: {q}",
            "artist": "Pulse Vibe Artist",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }
    ]

@app.get("/")
async def root():
    return {"status": "Pulse Vibe Server is running"}
