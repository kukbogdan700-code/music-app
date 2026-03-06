const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/search', async (req, res) => {
    const query = req.query.q || '';
    console.log('Поиск для:', query);
    
    try {
        // Тестовый список песен, чтобы проверить, что всё работает
        const results = [
            { title: query + " - Трек 1 (Demo)" },
            { title: query + " - Трек 2 (Demo)" },
            { title: query + " - Трек 3 (Demo)" }
        ];
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Сервер запущен на порту ${PORT});
});
