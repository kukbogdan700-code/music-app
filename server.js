const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', (req, res) => {
    const query = req.query.q || '';
    console.log('Поиск:', query);

    // Имитация базы данных с реальными MP3 ссылками для теста
    const musicDatabase = [
        { 
            title: "Phonk Drift", 
            artist: "Drive Music", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        },
        { 
            title: "Night City", 
            artist: "Synthwave", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
        }
    ];

    // Если ищут что-то конкретное, подставляем название в результат
    const results = musicDatabase.map(track => ({
        title: query + " - " + track.title,
        artist: track.artist,
        url: track.url
    }));

    res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Сервер с музыкой запущен!');
});
