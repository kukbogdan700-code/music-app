const express = require('express');
const scdl = require('soundcloud-downloader').default;
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// Для поиска будем использовать публичный API SoundCloud (через axios)
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        // Используем поиск через библиотеку scdl
        const searchResults = await scdl.search({
            query: query,
            resourceType: 'tracks',
            limit: 10
        });

        const tracks = searchResults.collection.map(item => ({
            title: item.title,
            artist: item.user.username,
            trackUrl: item.permalink_url, // Для SoundCloud используем URL вместо ID
            id: item.id
        }));
        res.json(tracks);
    } catch (e) {
        console.error('Search error:', e.message);
        res.json([]);
    }
});

app.get('/audio', async (req, res) => {
    const trackUrl = req.query.url;
    if (!trackUrl) return res.status(400).send('No URL provided');

    try {
        res.setHeader('Content-Type', 'audio/mpeg');
        // Стримим напрямую из SoundCloud без всяких куки!
        const stream = await scdl.download(trackUrl);
        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('SCDL Stream error:', err.message);
            if (!res.headersSent) res.status(500).end();
        });
    } catch (error) {
        console.error('SCDL Server error:', error.message);
        if (!res.headersSent) res.status(500).end();
    }
});

app.get('/', (req, res) => res.send('Pulse Vibe SoundCloud Server is Live!'));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log('Server started on port ' + port);
});
