const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// Поиск видео
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
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
        res.json([]);
    }
});

// Получение аудио-потока напрямую
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        // Устанавливаем заголовки, чтобы плеер понял, что это аудио
        res.setHeader('Content-Type', 'audio/mpeg');

        // Используем pipe для передачи потока напрямую в браузер
        ytdl(videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25 // Увеличиваем буфер для плавной работы
        }).pipe(res);

    } catch (error) {
        console.error('Ошибка стриминга:', error);
        res.status(500).send('Ошибка аудио');
    }
});
