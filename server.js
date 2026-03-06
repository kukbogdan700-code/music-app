const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

// Разрешаем запросы с твоего сайта
app.use(cors());

// Твой рабочий ключ YouTube
const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// 1. Поиск видео через официальный YouTube API
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json([]);

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 10,
                key: YOUTUBE_API_KEY
            }
        });
        
        const tracks = response.data.items.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            videoId: item.id.videoId
        }));
        
        res.json(tracks);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        res.json([]);
    }
});

// 2. Стриминг аудио (теперь напрямую через "трубу" pipe)
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        if (!ytdl.validateID(videoId)) {
            return res.status(400).send('Неверный ID видео');
        }

        // Устанавливаем правильный тип контента для плеера
        res.setHeader('Content-Type', 'audio/mpeg');

        // Запускаем поток данных напрямую от YouTube к пользователю
        ytdl(videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25 
        }).pipe(res);

    } catch (error) {
        console.error('Ошибка стриминга:', error);
        if (!res.headersSent) {
            res.status(500).send('Ошибка аудио');
        }
    }
});

// Проверка работы сервера
app.get('/', (req, res) => {
    res.json({ status: "Pulse Vibe Server Online" });
});

// Запуск на порту 10000 для Render
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер Pulse Vibe запущен на порту ${port}`);
});
