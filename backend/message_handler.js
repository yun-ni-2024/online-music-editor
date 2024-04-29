const {
    newTrack,
    delTrack,
    editNote
} = require('./edit');
const {
    fetchMusic
} = require('./fetch');

function handleMessage(message) {
    var ret = {
        sendBack: 0
    };

    switch (message.type) {
        case 'edit':
            handleEdit(message);
            break;
        case 'fetch':
            ret = handleFetch(message);
            break;
        default:
            console.log("Unknown type.");
            break;
    }

    return ret;
}

function handleEdit(message) {
    switch (message.option) {
        case 'new track':
            newTrack(message.id, message.beatNum, message.noteNum);
            break;
        case 'delete track':
            delTrack(message.id);
            break;
        case 'edit note':
            editNote(message.trackId, message.beatId, message.noteId, message.instrument);
            break;
        default:
            console.log("Unknown option.");
            break;
    }
}

function handleFetch(message) {
    var ret = {
        sendBack: 1
    };

    switch (message.option) {
        case 'fetch music':
            ret = fetchMusic();
            break;
        default:
            break;
    }

    return ret;
}

module.exports = {
    handleMessage
};
