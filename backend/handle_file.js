// let {
//     tmpMusic
// } = require('./tmp_music');

const {
    MusicFile,
    MusicDesc
} = require('./models')

async function saveFile() {
    MusicFile.findById(tmpMusic.fileId)
        .then(musicFile => {
            if (musicFile) {
                // 编辑文件内容
                musicFile.music = tmpMusic.music;

                // 保存文件更改
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

    // 保存音乐文件到数据库
    const musicFile = new MusicFile({
        music: tmpMusic.music
    });

    const savedMusicFile = await musicFile.save();
    fileId = savedMusicFile._id;

    // 保存音乐描述数据到数据库
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
