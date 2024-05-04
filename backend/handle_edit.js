let {
    tmpMusic
} = require('./tmp_music');

function newTrack(id, beatNum, noteNum) {
    tmpMusic.music.tracks.push({ beats: [] });
    for (let i = 0; i < beatNum; i++) {
        tmpMusic.music.tracks[id].beats.push({ notes: [] });
        for (let j = 0; j < noteNum; j++) {
            tmpMusic.music.tracks[id].beats[i].notes.push({ instrument: 'none' });
        }
    }
    // tmpMusic.addTrack(beatNum, noteNum);

    console.log(`New track, id = ${id}, beatNum = ${beatNum}, noteNum = ${noteNum}.`)
}

function delTrack(id) {
    tmpMusic.music.tracks.splice(id, 1);
    // tmpMusic.delTrack(id);

    console.log(`Delete Track, id = ${id}.`)
}

function editNote(trackId, beatId, noteId, instrument) {
    tmpMusic.music.tracks[trackId].beats[beatId].notes[noteId].instrument = instrument;
    // tmpMusic.getTrack(trackId).getBeat(beatId).getNote(noteId).edit(instrument);

    console.log(`Edit note: trackId = ${trackId}, beatId = ${beatId}, noteId = ${noteId}, instrument = ${instrument}`);
}

function clearTmpMusic() {
    tmpMusic.music.tracks = [];
    tmpMusic.isNew = true;
}

module.exports = {
    newTrack,
    delTrack,
    editNote,
    clearTmpMusic
};
