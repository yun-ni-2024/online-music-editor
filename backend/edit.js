const {
    tmpMusic
} = require('./tmp_music');

function newTrack(id, beatNum, noteNum) {
    tmpMusic.tracks.push({ beats: [] });
    for (let i = 0; i < beatNum; i++) {
        tmpMusic.tracks[id].beats.push({ notes: [] });
        for (let j = 0; j < noteNum; j++) {
            tmpMusic.tracks[id].beats[i].notes.push({ instrument: 'none' });
        }
    }
    // tmpMusic.addTrack(beatNum, noteNum);

    console.log(`New track, id = ${id}, beatNum = ${beatNum}, noteNum = ${noteNum}.`)
}

function delTrack(id) {
    tmpMusic.tracks.splice(id, 1);
    // tmpMusic.delTrack(id);

    console.log(`Delete Track, id = ${id}.`)
}

function editNote(trackId, beatId, noteId, instrument) {
    tmpMusic.tracks[trackId].beats[beatId].notes[noteId].instrument = instrument;
    // tmpMusic.getTrack(trackId).getBeat(beatId).getNote(noteId).edit(instrument);

    console.log(`Edit note: trackId = ${trackId}, beatId = ${beatId}, noteId = ${noteId}, instrument = ${instrument}`);
}

module.exports = {
    newTrack,
    delTrack,
    editNote
};
