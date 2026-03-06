const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/search', (req, res) => {
    const query = req.query.q || '';
    res.json([
        { title: query + " - Результат 1" },
        { title: query + " - Результат 2" }
    ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Сервер работает!');
});
