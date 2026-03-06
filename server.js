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
            highWaterMark: 1 << 25
        }).pipe(res);
    } catch (error) {
        console.error('Ошибка стриминга:', error.message);
        if (!res.headersSent) res.status(500).send('Error');
    }
});

app.get('/', (req, res) => res.json({ status: "OK" }));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
});
