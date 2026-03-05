const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Это чтобы сайт мог общаться с сервером

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        // Пока сервер просто подтверждает, что он видит твой поиск
        // Скоро мы заменим это на реальный поиск SoundCloud
        res.json([
            {
                title: 'Результат для: ' + query,
                artist: 'SoundCloud поиск скоро будет тут',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            }
        ]);
    } catch (error) {
        res.json({ error: 'Ошибка сервера' });
    }
});

app.listen(process.env.PORT || 3000);
