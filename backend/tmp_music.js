// class Note {
//     constructor() {
//         this.instrument = 'none';
//     }
//     edit(instrument) {
//         this.instrument = instrument;
//     }
// }

// class Beat {
//     constructor(noteNum) {
//         this.notes = new Array(noteNum).fill(null).map((_) => new Note());
//     }

//     getNote(id) {
//         return this.notes[id];
//     }
// }

// class Track {
//     constructor() {
//         this.beats = [];
//     }

//     addBeat(beatNum, noteNum) {
//         for (let i = 0; i < beatNum; i++) {
//             this.beats.push(new Beat(noteNum));
//         }
//     }

//     getBeat(id) {
//         return this.beats[id];
//     }
// }

// class TmpMusic {
//     constructor() {
//         this.tracks = [];
//     }

//     trackNum() {
//         return this.tracks.length;
//     }

//     addTrack(beatNum, noteNum) {
//         this.tracks.push(new Track());
//         this.tracks[this.trackNum() - 1].addBeat(beatNum, noteNum);
//     }
    
//     delTrack(id) {
//         this.tracks.splice(id, 1);
//     }

//     getTrack(id) {
//         return this.tracks[id];
//     }
// }

// const tmpMusic = new TmpMusic();

// module.exports = {
//     tmpMusic,
//     TmpMusic,
//     Note,
//     Beat,
//     Track
// };

tmpMusic = {
    tracks: []
};

module.exports = {
    tmpMusic
};
