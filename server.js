const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// ВАШ YouTube API ключ
const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// Поиск музыки на YouTube
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.json([]);
    }
    
    console.log('🔍 Поиск на YouTube:', query);
    
    try {
        // Ищем видео на YouTube
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query + ' music',
                type: 'video',
                maxResults: 15,
                key: YOUTUBE_API_KEY,
                videoCategoryId: '10' // Музыка
            }
        });
        
        const tracks = [];
        
        // Для каждого видео получаем детали
        for (const item of searchResponse.data.items) {
            const videoId = item.id.videoId;
            
            tracks.push({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                videoId: videoId,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: item.snippet.thumbnails.default.url
            });
        }
        
        console.log(`✅ Найдено треков: ${tracks.length}`);
        res.json(tracks);
        
    } catch (error) {
        console.error('❌ Ошибка YouTube:', error.message);
        res.json([]);
    }
});

app.get('/', (req, res) => {
    res.json({ 
        status: "🎵 YouTube Music Bot работает!",
        message: "Используй /search?q=rock для поиска"
    });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});
