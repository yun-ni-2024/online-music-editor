const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost",
    INIT_BEAT_NUM: 20,
    MAX_NOTE_NUM: 21
};

import {
    sendMessage
} from './message.js';

import {
    fetchMusic
} from './edit_play.js';

// 初始化
document.addEventListener("DOMContentLoaded", function() {
    const newMusicBtn = document.getElementById('new-music-button');

    // 添加鼠标点击事件的响应函数
    newMusicBtn.addEventListener('click', function() {
        // 删除新建按钮
        newMusicBtn.remove();

        const content = document.getElementById('content');

        // 添加音轨编辑栏
        const trackEditor = document.createElement('div');
        trackEditor.classList.add('track-editor');
        trackEditor.dataset.trackNum = String(0);
        console.log(config.INIT_BEAT_NUM)
        trackEditor.dataset.beatNum = String(config.INIT_BEAT_NUM);
        trackEditor.dataset.noteNum = String(config.MAX_NOTE_NUM);
        content.appendChild(trackEditor);

        // 添加新建音轨按钮
        const addTrackBtn = document.createElement('div');
        addTrackBtn.classList.add('add-track-button');
        addTrackBtn.textContent = '新建音轨';
        addTrackBtn.addEventListener('click', function(event) {
            event.stopPropagation();

            // 创建音轨容器元素
            const beatNum = parseInt(trackEditor.dataset.beatNum, 10);
            const noteNum = parseInt(trackEditor.dataset.noteNum, 10);
            const trackContainer = createTrackContainer(beatNum, noteNum);

            // 更新音轨容器id和音轨总数
            const id = parseInt(trackEditor.dataset.trackNum, 10)
            trackContainer.dataset.id = String(id);
            trackEditor.dataset.trackNum = String(id + 1);
            trackEditor.appendChild(trackContainer);

            console.log(`Add track, id = ${id}`);
            // 向后端发送消息，创建音轨
            sendMessage({
                type: 'edit',
                option: 'new track',
                id: id,
                beatNum: beatNum,
                noteNum: noteNum
            });

        });
        content.appendChild(addTrackBtn);

        // 添加播放按钮
        const playButton = document.createElement('div');
        playButton.classList.add('play-button');
        playButton.textContent = '播放所有音轨';

        // 为播放按钮添加相应函数
        playButton.addEventListener('click', function(){
            fetchMusic();
        });
        content.appendChild(playButton);
    });
});

// 创建音轨容器
function createTrackContainer(beatNum, noteNum) {
    // 创建音轨容器元素
    const trackContainer = document.createElement('div');
    trackContainer.classList.add('track-container');
    trackContainer.dataset.editMode = 'false';

    // 添加音轨
    const track = createTrack(beatNum, noteNum);
    trackContainer.appendChild(track);

    // 添加删除按钮
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '删除';
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();

        const id = parseInt(trackContainer.dataset.id, 10);
        const trackEditor = trackContainer.parentNode;

        // 删除音轨容器元素
        deleteTrackContainer(trackContainer);

        // 更新总音轨数量
        const trackNum = parseInt(trackEditor.dataset.trackNum, 10);
        trackEditor.dataset.trackNum = String(trackNum - 1);

        // 修改后继所有音轨编号
        for (let i = 0; i < trackEditor.children.length; i++) {
            const element = trackEditor.children[i];
            const elementId = parseInt(element.dataset.id, 10);
            if (element.classList.contains('track-container') && elementId > id) {
                element.dataset.id = String(elementId - 1);
            }
        }

        console.log(`Delete track, id = ${id}`)

        // 向后端发送消息，删除音轨
        sendMessage({
            type: 'edit',
            option: 'delete track',
            id: id
        });
    });
    trackContainer.appendChild(deleteButton);

    return trackContainer;
}

// 创建音轨
function createTrack(beatNum, noteNum) {
    // 创建音轨元素
    const track = document.createElement('div');
    track.classList.add('track');

    // 为这个音轨元素添加鼠标点击事件的响应函数
    track.addEventListener('click', function(event) {
        event.stopPropagation();
        const trackContainer = track.parentElement;
        toggleTrackEdit(trackContainer);
    });

    // 添加节拍
    for (let i = 0; i < beatNum; ++i) {
        // 创建节拍元素
        const beat = createBeat(noteNum);

        // 添加编号
        beat.dataset.id = String(i);
        track.appendChild(beat);
    }

    return track;
}

// 删除音轨容器
function deleteTrackContainer(trackContainer) {
    trackContainer.remove();
}

// 切管音轨容器状态为编辑状态
function toggleTrackEdit(trackContainer) {
    // 标记进入编辑模式
    if (trackContainer.dataset.editMode == 'true') {
        return;
    } else {
        trackContainer.dataset.editMode = 'true';
    }

    // 提升音轨高度
    const track = trackContainer.querySelector('.track');
    if (track) {
        track.style.height = '500px';
    }

    // 添加收回按钮
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.textContent = '收回';
    closeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        closeTrackEdit(trackContainer);
    }, {passive: true});
    trackContainer.appendChild(closeButton);
}

// 关闭音轨容器的编辑状态
function closeTrackEdit(trackContainer) {
    // 取消标记编辑模式
    trackContainer.dataset.editMode = 'false';

    // 降低音轨高度
    const track = trackContainer.querySelector('.track');
    if (track) {
        track.style.height = '70px';
    }

    // 删除收回按钮
    const closeButton = trackContainer.querySelector('.close-button');
    if (closeButton) {
        closeButton.remove();
    }
}

// 创建节拍
function createBeat(noteNum) {
    // 创建节拍元素
    const beat = document.createElement('div');
    beat.classList.add('beat');

    // 添加音符
    for (let i = 0; i < noteNum; ++i) {
        // 创建音符元素
        const note = createNote();

        // 添加编号
        note.dataset.id = String(noteNum - 1 - i);
        beat.appendChild(note);
    }

    return beat;
}

// 创建音符
function createNote() {
    // 创建音符元素
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.instrument = 'none';

    // 为这个音符元素添加鼠标点击时间的相应函数
    note.addEventListener('click', function(event) {
        event.stopPropagation();
        editNote(note);
    });

    return note;
}

// 编辑音符
function editNote(note) {
    // 定位音符编号
    const noteId = parseInt(note.dataset.id, 10);
    const beat = note.parentNode;
    const beatId = parseInt(beat.dataset.id, 10);
    const trackContainer = beat.parentNode.parentNode;
    const trackId = parseInt(trackContainer.dataset.id, 10);

    if (note.dataset.instrument == 'none') {
        // 添加音符特征
        note.style.backgroundColor = 'black';
        note.dataset.instrument = 'piano';

        // 向后端发送消息
        sendMessage({
            type: 'edit',
            option: 'edit note',
            trackId: trackId,
            beatId: beatId,
            noteId: noteId,
            instrument: 'piano'
        });
    } else {
        // 删除音符特征
        note.style.backgroundColor = 'aliceblue';
        note.dataset.instrument = 'none';

        // 向后端发送消息
        sendMessage({
            type: 'edit',
            option: 'edit note',
            trackId: trackId,
            beatId: beatId,
            noteId: noteId,
            instrument: 'none'
        });
    }
}
