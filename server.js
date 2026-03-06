const express = require('express');
const cors = require('cors');
const SoundCloud = require('soundcloud-scraper');
const app = express();
const client = new SoundCloud.Client();

// 1. Оставляем только эту расширенную настройку CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// 2. Главная страница
app.get('/', (req, res) => {
    res.send('Сервер Pulse Vibe работает и готов искать музыку!');
});

// 3. Поиск треков
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const results = await client.search(query, 'track');
        const tracks = results.slice(0, 5).map(track => ({
            title: track.title,
            artist: track.author.name,
            url: track.url
        }));
        res.json(tracks);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        res.status(500).json({ error: 'Ошибка поиска' });
    }
});

// 4. Получение аудио-потока
app.get('/stream', async (req, res) => {
    const trackUrl = req.query.url;
    try {
        const stream = await client.getStream(trackUrl);
        stream.pipe(res);
    } catch (error) {
        console.error('Ошибка стриминга:', error);
        res.status(500).send('Ошибка стриминга');
    }
});

// 5. Запуск сервера с правильными кавычками 
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер Pulse Vibe запущен на порту ${PORT}`);
});
