const express = require('express');
const scdl = require('soundcloud-downloader').default;
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    try {
        const results = await scdl.search({ query: req.query.q, resourceType: 'tracks', limit: 10 });
        const tracks = results.collection.map(item => ({
            title: item.title,
            artist: item.user.username,
            url: item.permalink_url
        }));
        res.json(tracks);
    } catch (e) {
        res.json([]);
    }
});

app.get('/audio', async (req, res) => {
    try {
        const stream = await scdl.download(req.query.url);
        res.setHeader('Content-Type', 'audio/mpeg');
        stream.pipe(res);
    } catch (e) {
        res.status(500).send('Error');
    }
});

app.get('/', (req, res) => res.send('Pulse OK'));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log('Server started on port ' + port));
