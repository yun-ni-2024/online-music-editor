const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    instrument: String
})

const beatSchema = new mongoose.Schema({
    notes: [noteSchema]
})

const trackSchema = new mongoose.Schema({
    beats: [beatSchema]
})

const musicSchema = new mongoose.Schema({
    tracks: [trackSchema]
});

const musicFileSchema = new mongoose.Schema({
    fileName: String,
    music: musicSchema
});

const musicDescSchema = new mongoose.Schema({
    fileId: String,
    fileName: String
});

const MusicFile = mongoose.model('MusicFile', musicFileSchema);
const MusicDesc = mongoose.model('MusicDesc', musicDescSchema);

module.exports = {
    MusicFile,
    MusicDesc
};
