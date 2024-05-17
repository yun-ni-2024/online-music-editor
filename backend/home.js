const express = require('express');
const bodyParser = require('body-parser');

const {
    MusicDesc
} = require('./models');

const homeRoutes = express.Router();

// 解析请求体中的 JSON 数据
// homeRoutes.use(bodyParser.json());

homeRoutes.get('/', async (req, res) => {
    console.log('Handling GET /home');
    
    const uid = req.query.uid;
    console.log('uid=', uid)

    try{
        const musicDescs = await MusicDesc.find({ uid: uid });
        console.log('Finding my music:', musicDescs);
        res.status(200).json({ musicDescs: musicDescs });
    } catch (error) {
        console.error('Error Finding my music desc:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    homeRoutes
};
