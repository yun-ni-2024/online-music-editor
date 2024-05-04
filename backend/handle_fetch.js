let {
    tmpMusic
} = require('./tmp_music');

const {
    MusicFile,
    MusicDesc
} = require('./models')

async function fetchCurrentMusic() {
    return tmpMusic.music;
}

async function fetchMyMusicDesc(uid) {
    try{
        const musicDescs = await MusicDesc.find({ uid: uid });
        return musicDescs
    } catch (error) {
        console.error('Error Finding my music desc:', error);
    }
}

async function fetchOpenedMusic() {
    console.log(`tmpMusic = ${tmpMusic}`)
    return tmpMusic;
}


module.exports = {
    fetchCurrentMusic,
    fetchMyMusicDesc,
    fetchOpenedMusic
};
