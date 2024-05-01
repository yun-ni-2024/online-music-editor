const {
    tmpMusic
} = require('./tmp_music');

const {
    MusicFile,
    MusicDesc
} = require('./models')

function saveFile(fileName) {
    let fileId = 'none';

    // 保存音乐文件到数据库
    const musicFile = new MusicFile({
        fileName: fileName,
        music: tmpMusic
    })

    musicFile.save()
        .then(savedMusicFile => {
            console.log('Music file saved successfully:', savedMusicFile, savedMusicFile._id);
            fileId = savedMusicFile._id;

            // 保存音乐描述数据到数据库
            const musicDesc = new MusicDesc({
                fileId: fileId,
                fileName: fileName
            })

            musicDesc.save()
                .then(savedMusicDesc => {
                    console.log('Music desc saved successfully:', savedMusicDesc, savedMusicDesc._id);
                })
                .catch(error => {
                    console.error('Error saving music desc:', error);
                });
        })
        .catch(error => {
            console.error('Error saving music:', error);
        });
}

module.exports = {
    saveFile
};
