const {
    newTrack,
    delTrack,
    editNote
} = require('./handle_edit');

const {
    fetchCurrentMusic,
    fetchAllMusicDesc,
    fetchOpenedMusic
} = require('./handle_fetch');

const {
    saveFile,
    openMyFile
} = require('./handle_file');

async function handleMessage(message) {
    var ret = {
        sendBack: 0
    };

    switch (message.type) {
        case 'edit':
            handleEdit(message);
            break;
        case 'fetch':
            ret = await handleFetch(message);
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

async function handleFetch(message) {
    var ret = {
        sendBack: 1
    };

    switch (message.option) {
        case 'fetch current music':
            try {
                const currMusic = await fetchCurrentMusic();
                ret.data = {
                    type: 'music',
                    data: currMusic
                }
            } catch (error) {
                console.error('Error fetching current music:', error);
            }
            break;
        case 'fetch all music desc':
            try {
                const musicDescs = await fetchAllMusicDesc();
                ret.data = {
                    type: 'all music desc',
                    data: musicDescs
                }
            } catch (error) {
                console.error('Error fetching music list:', error);
            }
            break;
        case 'fetch opened music':
            try {
                const openedMusic = await fetchOpenedMusic();
                ret.data = {
                    type: 'opened music',
                    data: openedMusic
                }
            } catch (error) {
                console.error('Error fetching opened music:', error);
            }
            break;
        default:
            break;
    }

    return ret;
}

function handleFile(message) {
    switch (message.option) {
        case 'save file':
            saveFile(message.fileName);
            break;
        case 'open my file':
            openMyFile(message.id);
            break;
        default:
            break;
    }
}

module.exports = {
    handleMessage
};
