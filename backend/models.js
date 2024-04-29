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

module.exports = mongoose.model('Music', musicSchema);
