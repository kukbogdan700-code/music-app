const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const SOUNDCLOUD_CLIENT_ID = 'zIVNInsmJRApjUZSnEhz56WohoBMdUQU';

// Поиск треков
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    console.log('🔍 Поиск:', query);
    
    try {
        // Пробуем SoundCloud API
        const response = await axios.get('https://api-v2.soundcloud.com/search/tracks', {
            params: {
                q: query,
                client_id: SOUNDCLOUD_CLIENT_ID,
                limit: 10
            }
        });
        
        const tracks = response.data.collection.map(track => ({
            title: track.title,
            artist: track.user.username,
            url: track.permalink_url
        }));
        
        res.json(tracks);
        
    } catch (error) {
        console.log('SoundCloud ошибка, используем демо');

// Проверка сервера
app.get('/', (req, res) => {
    res.json({ 
        status: "✅ Pulse Vibe работает!",
        port: process.env.PORT || 10000
    });
});

// ВАЖНО: используем порт от Render
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});
