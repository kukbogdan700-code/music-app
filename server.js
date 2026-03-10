const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

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
            },
            timeout: 10000 // Ждем ответ от Google не более 10 сек
        });
        
        const tracks = response.data.items.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            videoId: item.id.videoId
        }));
        
        res.json(tracks);
    } catch (error) {
        console.error('Ошибка поиска:', error.message);
        res.status(500).json([]); // Отдаем пустой массив вместо падения
    }
});

app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    try {
        if (!ytdl.validateID(videoId)) return res.status(400).send('Invalid ID');

        res.setHeader('Content-Type', 'audio/mpeg');
        
        ytdl(videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            requestOptions: {
                headers: {
                    // Имитируем браузер, чтобы YouTube не блокировал поток
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        }).pipe(res);

    } catch (error) {
        console.error('Ошибка стриминга:', error.message);
        if (!res.headersSent) res.status(500).send('Error');
    }
});
