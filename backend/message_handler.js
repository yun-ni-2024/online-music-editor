const {
    newTrack,
    delTrack,
    editNote
} = require('./handle_edit');

const {
    fetchCurrentMusic,
    fetchAllMusicDesc
} = require('./handle_fetch');

const {
    saveFile
} = require('./handle_file');

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
        case 'file':
            handleFile(message);
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
    console.log('Handling fetch.');

    var ret = {
        sendBack: 1
    };

    switch (message.option) {
        case 'fetch current music':
            ret = fetchCurrentMusic();
            break;
        case 'fetch all music desc':
            try {
                const musicList = fetchAllMusicDesc();
                ret = {
                    sendBack: 1,
                    data: musicList
                };
                console.log(`fetchAllMusicDesc()=${musicList}`)
                console.log(`ret=${ret}`)
                return ret;
            } catch (error) {
                console.error('Error fetching music list:', error);
            }
            break;
        default:
            break;
    }
}

function handleFile(message) {
    switch (message.option) {
        case 'save file':
            saveFile(message.fileName);
            break;
        default:
            break;
    }
}

module.exports = {
    handleMessage
};
