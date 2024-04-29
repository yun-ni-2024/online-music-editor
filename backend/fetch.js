const {
    tmpMusic,
    emptyTrack,
    emptyBeat,
    emptyNote
} = require('./tmp_music');

function fetchMusic() {
    const ret = {
        sendBack: 1,
        data: {
            type: 'music',
            data: tmpMusic
        }
    }

    return ret;
}

module.exports = {
    fetchMusic
};
