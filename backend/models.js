const mongoose = require('mongoose');

const musicFileSchema = new mongoose.Schema({
    music: mongoose.Schema.Types.Mixed
});

const musicDescSchema = new mongoose.Schema({
    uid: String,
    fileId: String,
    fileName: String
});

const dbInfoSchema = new mongoose.Schema({
    maxId: String
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const MusicFile = mongoose.model('MusicFile', musicFileSchema);
const MusicDesc = mongoose.model('MusicDesc', musicDescSchema);
const DbInfo = mongoose.model('DbInfo', dbInfoSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    MusicFile,
    MusicDesc,
    DbInfo,
    User
};
