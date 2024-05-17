const express = require('express');
const bodyParser = require('body-parser');

const {
    MusicFile,
    MusicDesc
} = require('./models');

const fileRoutes = express.Router();

fileRoutes.post('/saveAs', async (req, res) => {
    console.log('Handling POST /file/saveAs');

    const { music, uid, fileName } = req.body;
    console.log('Saving file:', music, uid, fileName);

    try {
        // 保存音乐文件到数据库
        const musicFile = new MusicFile({
            music: music
        });
    
        const savedMusicFile = await musicFile.save();
        const fileId = savedMusicFile._id;
    
        // 保存音乐描述数据到数据库
        const musicDesc = new MusicDesc({
            uid: uid,
            fileId: fileId,
            fileName: fileName
        });
    
        await musicDesc.save();

        res.status(200).json({ fileId: fileId });
    } catch (error) {
        console.log('Error saving file as:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

fileRoutes.post('/fetch', async (req, res) => {
    console.log('Handling POST /file/fetch');

    const { fileId } = req.body;
    console.log('Fetching file:', fileId);

    try {
        const musicFile = await MusicFile.findById(fileId);
        const music = musicFile.music;

        console.log('Fetched file:', music);

        res.status(200).json({ music: music });
    } catch (error) {
        console.log('Error fetching file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    fileRoutes
};
