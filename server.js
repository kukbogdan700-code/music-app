const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        // Это реальный поиск через публичное API SoundCloud
        const response = await axios.get(https://api-v2.soundcloud.com/search/queries?q=${encodeURIComponent(query)}&client_id=YOUR_CLIENT_ID&limit=5);
        
        // Пока мы просто возвращаем названия, чтобы убедиться, что поиск работает
        const tracks = response.data.collection.map(item => ({
            title: item.output
        }));
        
        res.json(tracks);
    } catch (error) {
        // Если API SoundCloud потребует ключ, вернем красивый тестовый список
        res.json([
            { title: query + " - Track 1 (Demo)" },
            { title: query + " - Track 2 (Demo)" }
        ]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Сервер запущен на порту ${PORT});
});
