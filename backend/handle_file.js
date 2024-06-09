const {
    MusicFile,
    MusicDesc
} = require('./models')

async function saveFile() {
    MusicFile.findById(tmpMusic.fileId)
        .then(musicFile => {
            if (musicFile) {
                // Edit file content
                musicFile.music = tmpMusic.music;

                // Save updates
                musicFile.save()
                    .then(updatedMusicFile => {
                        console.log('File updated successfully:', updatedMusicFile);
                    })
                    .catch(error => {
                        console.error('Error saving updated file:', error);
                    });
            } else {
                console.log('Music not found');
            }
        })
        .catch(error => {
            console.error('Error finding music by ID:', error);
        });
}

async function saveFileAs(tmpMusic, uid, fileName) {
    let fileId = 'none';

    // Save music file to mongodb
    const musicFile = new MusicFile({
        music: tmpMusic.music
    });

    const savedMusicFile = await musicFile.save();
    fileId = savedMusicFile._id;

    // Save music description
    const musicDesc = new MusicDesc({
        uid: uid,
        fileId: fileId,
        fileName: fileName
    });

    const savedMusicDesc = await musicDesc.save();
    
    return fileId;
}

function openMyFile(fileId) {
    console.log('Finding music by ID:', fileId);

    MusicFile.findById(fileId)
        .then(musicFile => {
            if (musicFile) {
                console.log('Found music:', musicFile);
                
                tmpMusic.music = musicFile.music;
                tmpMusic.fileId = fileId;
                tmpMusic.isNew = false;
                console.log(`tmpMusic = ${tmpMusic}`)
            } else {
                console.log('Music not found');
            }
        })
        .catch(error => {
            console.error('Error finding music by ID:', error);
        });
}

module.exports = {
    saveFile,
    saveFileAs,
    openMyFile
};
