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

// Получение аудио
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        const info = await ytdl.getInfo(videoId);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
        res.redirect(format.url);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка аудио' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: "Сервер работает" });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${port}`);
});
