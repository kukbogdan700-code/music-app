const express = require('express');
const cors = require('cors');
const SoundCloud = require('soundcloud-scraper');
const app = express();
const client = new SoundCloud.Client();

app.use(cors());

// Поиск треков
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const results = await client.search(query, 'track');
        const tracks = results.slice(0, 5).map(track => ({
            title: track.title,
            artist: track.author.name,
            url: track.url // Ссылка на страницу для стриминга
        }));
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка поиска' });
    }
});

// Получение аудио-потока
app.get('/stream', async (req, res) => {
    const trackUrl = req.query.url;
    try {
        const stream = await client.getStream(trackUrl);
        stream.pipe(res); // Передаем музыку прямо в плеер
    } catch (error) {
        res.status(500).send('Ошибка стриминга');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Сервер Pulse Vibe готов к работе!`);
});
