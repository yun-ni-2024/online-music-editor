const {
    newTrack,
    delTrack,
    editNote,
    clearTmpMusic
} = require('./handle_edit');

const {
    fetchCurrentMusic,
    fetchMyMusicDesc,
    fetchOpenedMusic
} = require('./handle_fetch');

const {
    saveFile,
    saveFileAs,
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
            ret = await handleFile(message);
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
        case 'clear tmp music':
            clearTmpMusic();
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
        case 'fetch my music desc':
            try {
                const musicDescs = await fetchMyMusicDesc(message.uid);
                ret.data = {
                    type: 'my music desc',
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
            console.log("Unknown option.");
            break;
    }

    return ret;
}

async function handleFile(message) {
    var ret = {
        sendBack: 0
    };
    switch (message.option) {
        // case 'save file':
        //     await saveFile();
        //     break;
        // case 'save file as':
        //     saveFileAs(message.uid, message.fileName);
        //     break;
        case 'fetch my file':
            openMyFile(message.id);
            break;
        case 'save as':
            ret.sendBack = 1;
            ret.data = {
                type: 'file id',
                data: await saveFileAs(message.tmpMusic, message.uid, message.fileName)
            };
            break;
        default:
            console.log("Unknown option.");
            break;
    }

    return ret;
}

module.exports = {
    handleMessage
};
