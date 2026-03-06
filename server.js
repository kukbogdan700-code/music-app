const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

// Настройка CORS для Telegram
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Range'],
    exposedHeaders: ['Content-Length', 'Content-Range']
}));

app.use(express.json());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// Поиск видео на YouTube
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    try {
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query + ' audio',
                type: 'video',
                maxResults: 10,
                key: YOUTUBE_API_KEY,
                videoCategoryId: '10'
            }
        });
        
        const tracks = [];
        
        for (const item of searchResponse.data.items) {
            tracks.push({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url
            });
        }
        
        res.json(tracks);
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        res.json([]);
    }
});

// Получение аудиопотока
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        console.log('🎵 Запрос аудио для videoId:', videoId);
        
        // Настройка заголовков для аудиопотока
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range');
        
        // Получаем аудиопоток с YouTube
        const stream = ytdl(videoId, {
            filter: 'audioonly',
            quality: 'lowestaudio',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        });
        
        // Отправляем поток клиенту
        stream.on('error', (error) => {
            console.error('Ошибка потока:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Ошибка аудиопотока' });
            }
        });
        
        stream.pipe(res);
        
    } catch (error) {
        console.error('❌ Ошибка получения аудио:', error);
        res.status(500).json({ error: 'Не удалось получить аудио' });
    }
});

// Обработка OPTIONS запросов для CORS
app.options('/audio/:videoId', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.json({ 
        status: "🎵 Pulse Vibe Audio Server работает!",
        message: "Используйте /search?q=rock для поиска"
    });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});
