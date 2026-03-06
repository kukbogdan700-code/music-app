const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ВАШ Client ID от SoundCloud
const SOUNDCLOUD_CLIENT_ID = 'zIVNInsmJRApjUZSnEhz56WohoBMdUQU';

// Поиск треков на SoundCloud
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.json([]);
    }
    
    try {
        console.log('🔍 Поиск на SoundCloud:', query);
        
        // Получаем треки с SoundCloud
        const response = await axios.get('https://api.soundcloud.com/tracks', {
            params: {
                q: query,
                client_id: SOUNDCLOUD_CLIENT_ID,
                limit: 15,
                linked_partitioning: 1
            }
        });
        
        // Преобразуем в нужный формат
        const tracks = response.data.collection.map(track => ({
            title: track.title,
            artist: track.user.username,
            url: track.stream_url + '?client_id=' + SOUNDCLOUD_CLIENT_ID,
            duration: track.duration,
            artwork: track.artwork_url || track.user.avatar_url
        }));
        
        console.log(`✅ Найдено треков: ${tracks.length}`);
        res.json(tracks);
        
    } catch (error) {
        console.error('❌ Ошибка SoundCloud:', error.message);
        res.status(500).json({ error: 'SoundCloud API error' });
    }
});

app.get('/', (req, res) => {
    res.json({ 
        status: "Pulse Vibe SoundCloud Server работает!",
        client_id: "zIVNInsmJRApjUZSnEhz56WohoBMdUQU",
        endpoints: {
            search: "/search?q=rock"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
