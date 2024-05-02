let {
    tmpMusic
} = require('./tmp_music');

const {
    MusicFile,
    MusicDesc
} = require('./models')

async function fetchCurrentMusic() {
    return tmpMusic;
}

async function fetchAllMusicDesc() {
    return MusicDesc.find({}).exec();
}

async function fetchOpenedMusic() {
    console.log(`tmpMusic = ${tmpMusic}`)
    return tmpMusic;
}


module.exports = {
    fetchCurrentMusic,
    fetchAllMusicDesc,
    fetchOpenedMusic
};
