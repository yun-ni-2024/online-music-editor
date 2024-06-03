const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const {
    MusicFile,
    MusicDesc
} = require('./models');

const fileRoutes = express.Router();

let port = 4333;

fileRoutes.post('/saveAs', async (req, res) => {
    console.log('Handling POST /file/saveAs');

    const { music, uid, fileName } = req.body;
    console.log('Saving file as:', music, uid, fileName);

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

fileRoutes.post('/save', async (req, res) => {
    console.log('Handling POST /file/save');

    const { updatedMusic } = req.body;
    console.log('Saving file:', updatedMusic);

    try {
        const musicId = music.fileId;
        const originalMusic = await MusicFile.findById(musicId);

        originalMusic.music = updatedMusic;

        await originalMusic.save();
    } catch (error) {
        console.error('Error updating music:', error);
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

fileRoutes.post('/cowork', async (req, res) => {
    console.log('Handling POST /file/cowork');

    const { tmpMusic } = req.body;
    console.log('tmpMusic:', tmpMusic);

    try {
        const coworkApp = express();
        const server = http.createServer(coworkApp);
        const io = socketIo(server);

        coworkApp.use(express.static('public'));

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('get currMusic', () => {
                socket.emit('currMusic', tmpMusic);
            });

            socket.on('add track', (opt) => {
                console.log('Receive socket message: add track');

                tmpMusic.music.tracks.push({ beats: [] });
                for (let i = 0; i < opt.beatNum; i++) {
                    tmpMusic.music.tracks[opt.trackId].beats.push({ notes: [] });
                    for (let j = 0; j < opt.noteNum; j++) {
                        tmpMusic.music.tracks[opt.trackId].beats[i].notes.push({ instrument: 'none' });
                    }
                }

                socket.broadcast.emit('add track', opt);
            });

            socket.on('del track', (opt) => {
                console.log('Receive socket message: del track');

                tmpMusic.music.tracks.splice(opt.trackId, 1);

                socket.broadcast.emit('del track', opt);
            });

            socket.on('edit note', (opt) => {
                console.log('Receive socket message: edit note');

                tmpMusic.music.tracks[opt.trackId].beats[opt.beatId].notes[opt.noteId].instrument = opt.instrument;

                socket.broadcast.emit('edit note', opt);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        port++;
        server.listen(port, () => {
            console.log('listening on port:', port);
        });

        res.status(200).json({ port: port });
    } catch (error) {
        console.error('Error starting coworking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    fileRoutes
};
