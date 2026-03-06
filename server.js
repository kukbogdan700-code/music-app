const express = require('express');
const cors = require('cors');
const SoundCloud = require('soundcloud-scraper');
const app = express();
const client = new SoundCloud.Client();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    console.log('Поиск в SoundCloud:', query);

    try {
        // Ищем треки по твоему запросу
        const results = await client.search(query, 'track');
        
        // Берем первые 5 результатов и превращаем их в удобный формат
        const tracks = results.slice(0, 5).map(track => ({
            title: track.title,
            artist: track.author.name,
            url: track.url // Ссылка на страницу трека
        }));

        res.json(tracks);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        res.status(500).json({ error: 'Ошибка при поиске музыки' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер Pulse Vibe на порту ${PORT} готов к поиску!`);
});
