const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const SOUNDCLOUD_CLIENT_ID = 'zIVNInsmJRApjUZSnEhz56WohoBMdUQU';

app.get('/search', async (req, res) => {
    const query = req.query.q;
    
    try {
        const response = await axios.get('https://api.soundcloud.com/tracks', {
            params: {
                q: query,
                client_id: SOUNDCLOUD_CLIENT_ID,
                limit: 10
            }
        });
        
        const tracks = response.data.map(track => ({
            title: track.title,
            artist: track.user.username,
            url: track.stream_url + '?client_id=' + SOUNDCLOUD_CLIENT_ID
        }));
        
        res.json(tracks);
    } catch (error) {
        res.json([]);
    }
});

app.get('/', (req, res) => {
    res.json({ status: "Pulse Vibe работает с SoundCloud!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
