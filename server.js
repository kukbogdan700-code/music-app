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
    try {
        res.setHeader('Content-Type', 'audio/mpeg');
        ytdl(req.params.videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }).pipe(res);
    } catch (e) {
        res.status(500).send('Error');
    }
});

app.get('/', (req, res) => res.send('Pulse Server OK'));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log('Started'));
