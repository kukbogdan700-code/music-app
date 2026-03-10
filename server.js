process.env.YTDL_NO_UPDATE = 'true'; // Отключаем лишние запросы обновлений
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core'); // Используем новое имя из package.json
const app = express();

app.use(cors());

const YOUTUBE_API_KEY = 'AIzaSyDEGUB8bUNvwElyQEfTGD76tFlUXZrnWpg';

// Поиск треков через YouTube API
app.get('/search', async (req, res) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: req.query.q,
                type: 'video',
                maxResults: 10,
                key: YOUTUBE_API_KEY
            }
        });
        const tracks = response.data.items.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            videoId: item.id.videoId
        }));
        res.json(tracks);
    } catch (e) {
        console.error('Ошибка поиска:', e.message);
        res.json([]);
    }
});

// Стриминг аудио с использованием твоих COOKIE
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    try {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');

        const stream = ytdl(videoId, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            requestOptions: {
                requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Cookie': '__Secure-YENID=14.YTE=KcZ3W4V9OuMirHs86uzYNH5sxrvnfOZEWPterfbLsk4t1Lod9zmGYRW8uMXwAWwDIWtYEpQHspPGL0ghHvvEOuB4UrnJwiwvkWBHFAELiounFHE5M3H7Xklpa8ByniW4PEW-qSEQ3YcxgDjClYIQwL4glvlwo6QHQDlw487pT29QOz13JXSjr82ZUXA1iYYML2u9hvm3Yy83ZtCHJO1H-0kA0nKNirsxwikjJ6mQoxIrmPKcu1GfE0m_PEC7yaPSZosiHs4KTVE8Kq51qsetkIn1txJLKkHv38LhaNl_8fkNa_xu06v6EaHRd5nFVgC7RZoL3gW54XSKskX1SNzjxw; Secure-3PAPISID=UGd1EmrWmdGPgkey/Axmf93drbiGIQoMoh; Secure-3PSID=g.a0007AiknysKSQ9LVSYbwzKbPJfhB7m9z8JJLzdnHpdSp3mrcTLRaUovlNZwFnEqo_kSWj0MLAACgYKAUMSARMSFQHGX2MiCdMCGnPjsAUEWCCULjiwERoVAUF8yKoeWh5QDcPYK11mHV7gqc2T0076; LOGIN_INFO=AFmmF2swRQIhAK0N-BNkOocYtXY-ca1wOGeN9quJzPxeQ67UEWCppctiAiBAVwIX9EcQt530F23Z8pOZpbVn_8TJ-VLDloe7Ztcm2Q:QUQ3MjNmeVpucE5leVh3cl9FX0ZMTVBCdVJXUWJDdmVTSUtESTRuSVJ3Y0liWFQ1WFd2XzVWaFdacmVGdWN3a043ckg3Q3h3UG1peHBvR01QMnpvaGdnNzhtbXFkQkZRWThrN0lKMnBLTnZKVDg4c2o5V2VsTnBIY0xTUlQ0RnotS3I3R2ZpZGk3V3N2Qjl3VHJCX2MtcXVZLTFSQ1BJQ2Jn; PREF=f6=40000000&tz=Europe.Moscow&f7=100; __Secure-YNID=16.YT=erkjyG7ConaMBvfeX8FQxs9KztTMI_43XCtkGU1KOh9HmavbPKqwR1FegdrCdXTFmRuka5w17FHSmKRIoL9rvc7pxBmiIdPlbgJe454CmOSFwvx7nbkYnznVxTcEbETwGqYolCLBvqskN0FdV-vr1q-DFvCz2jxOCmdf3ni9WcpyDOVY2bjY7s5ObmYPYJt3X_xI_5RG7yD-pVWBmaPBej7ZrUkjx2aPMjhcAkrAVfHiGcEMEcMFDUKuHCY0G6DX5VADTEwVpiX1NWibCfyJtTYmCxgEerz_R8esYZhYAVLBbWOUJGKPFc8JIS0K6xPKk_2F2S4gO_ZzwJfZupyGsA; YSC=gcrq_6U-dRU; VISITOR_INFO1_LIVE=75JTYq1ye9g; VISITOR_PRIVACY_METADATA=CgJSVRIEGgAgYQ%3D%3D; __Secure-ROLLOUT_TOKEN=CMmJgMT3of6nWhDbnsa6oImTAxiT0MKi3ZWTAw%3D%3D; __Secure-1PSIDTS=sidts-CjUBBj1CYkSkQgc3SCONt7UQOsTJB2ZMU_Z2exT3GkkAw65UDKCFAWcfJILGNWpN7mcNMMJGuRAA; __Secure-3PSIDTS=sidts-CjUBBj1CYkSkQgc3SCONt7UQOsTJB2ZMU_Z2exT3GkkAw65UDKCFAWcfJILGNWpN7mcNMMJGuRAA; __Secure-3PSIDCC=AKEyXzVzfJLBGVy3gRKqIgA0880X8dDM5dAheV3FsV2JGHHkVJNDmQLXL7ICwMINxIK3VCs4gw; ST-tladcw=session_logininfo=AFmmF2swRQIhAK0N-BNkOocYtXY-ca1wOGeN9quJzPxeQ67UEWCppctiAiBAVwIX9EcQt530F23Z8pOZpbVn_8TJ-VLDloe7Ztcm2Q%3AQUQ3MjNmeVpucE5leVh3cl9FX0ZMTVBCdVJXUWJDdmVTSUtESTRuSVJ3Y0liWFQ1WFd2XzVWaFdacmVGdWN3a043ckg3Q3h3UG1peHBvR01QMnpvaGdnNzhtbXFkQkZRWThrN0lKMnBLTnZKVDg4c2o5V2VsTnBIY0xTUlQ0RnotS3I3R2ZpZGk3V3N2Qjl3VHJCX2MtcXVZLTFSQ1BJQ2Jn; ST-xuwub9=session_logininfo=AFmmF2swRQIhAK0N-BNkOocYtXY-ca1wOGeN9quJzPxeQ67UEWCppctiAiBAVwIX9EcQt530F23Z8pOZpbVn_8TJ-VLDloe7Ztcm2Q%3AQUQ3MjNmeVpucE5leVh3cl9FX0ZMTVBCdVJXUWJDdmVTSUtESTRuSVJ3Y0liWFQ1WFd2XzVWaFdacmVGdWN3a043ckg3Q3h3UG1peHBvR01QMnpvaGdnNzhtbXFkQkZRWThrN0lKMnBLTnZKVDg4c2o5V2VsTnBIY0xTUlQ0RnotS3I3R2ZpZGk3V3N2Qjl3VHJCX2MtcXVZLTFSQ1BJQ2Jn',
                    'Referer': 'https://www.youtube.com/',
                    'Origin': 'https://www.youtube.com/'
                }
            }
       });

        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('Ошибка стрима:', err.message);
            if (!res.headersSent) res.status(500).end();
        });

    } catch (error) {
        console.error('Ошибка сервера:', error.message);
        if (!res.headersSent) res.status(500).end();
    }
});

app.get('/', (req, res) => res.send('Pulse Vibe Server is Live!'));

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log(Сервер запущен на порту ${port}));
