const {
    tmpMusic
} = require('./tmp_music');

const {
    MusicFile,
    MusicDesc
} = require('./models')

function fetchCurrentMusic() {
    const ret = {
        sendBack: 1,
        data: {
            type: 'music',
            data: tmpMusic
        }
    }

    return ret;
}

function fetchAllMusicDesc() {
    // var ret = {
    //     sendBack: 1
    // }

    // MusicDesc.find({}, (err, data) => {
    //     if (err) {
    //         console.error('Error fetching music desc:', err);
    //     } else {
            // ret = {
            //     sendBack: 1,
            //     data: {
            //         type: 'all music desc',
            //         data: data
            //     }
            // }
    //     }
    // });

    // return ret;
    MusicDesc.find({}).exec()
        .then(data => {
            console.log(data);
            return {
                type: 'all music desc',
                data: data
            }
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to fetch music data');
        });
}

module.exports = {
    fetchCurrentMusic,
    fetchAllMusicDesc
};
