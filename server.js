const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// Поиск видео на YouTube
app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    try {
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query + ' audio',
                type: 'video',
                maxResults: 10,
                key: YOUTUBE_API_KEY,
                videoCategoryId: '10'
            }
        });
        
        const tracks = [];
        
        for (const item of searchResponse.data.items) {
            tracks.push({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url
            });
        }
        
        res.json(tracks);
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        res.json([]);
    }
});

// Получение аудиопотока
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    
    try {
        // Получаем информацию о видео
        const info = await ytdl.getInfo(videoId);
        
        // Выбираем аудиоформат
        const audioFormat = ytdl.chooseFormat(info.formats, { 
            filter: 'audioonly',
            quality: 'lowest' // Можно 'lowest' для экономии трафика
        });
        
        // Перенаправляем на аудиопоток
        res.redirect(audioFormat.url);
        
    } catch (error) {
        console.error('Ошибка получения аудио:', error);
        res.status(500).json({ error: 'Не удалось получить аудио' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: "🎵 Pulse Vibe Audio Server работает!" });
});

// Устанавливаем зависимости: npm install ytdl-core
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});
