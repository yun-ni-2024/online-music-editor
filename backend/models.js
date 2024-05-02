const mongoose = require('mongoose');

const musicFileSchema = new mongoose.Schema({
    music: mongoose.Schema.Types.Mixed
});

const musicDescSchema = new mongoose.Schema({
    fileId: String,
    fileName: String
});

const dbInfoSchema = new mongoose.Schema({
    maxId: String
});

const MusicFile = mongoose.model('MusicFile', musicFileSchema);
const MusicDesc = mongoose.model('MusicDesc', musicDescSchema);
const DbInfo = mongoose.model('DbInfo', dbInfoSchema);

module.exports = {
    MusicFile,
    MusicDesc,
    DbInfo
};
