const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

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
        res.status(500).json([]);
    }
});

app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    try {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes'); // Важно для перемотки и старта

        const stream = ytdl(videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.youtube.com/',
                    'Origin': 'https://www.youtube.com/'
                }
            }
        });

        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('Ошибка потока:', err.message);
            if (!res.headersSent) res.status(500).end();
        });

    } catch (error) {
        console.error('Ошибка сервера:', error.message);
        res.status(500).end();
    }
});

app.get('/', (req, res) => res.send('Pulse Server OK'));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log('Started'));
