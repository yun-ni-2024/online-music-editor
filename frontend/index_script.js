const online = true;
const onlineIP = '119.45.17.160';
const offlineIP = 'localhost';
const INIT_BEAT_NUM = 20;
const MAX_NOTE_NUM = 21;


// 页面动画

const menuItems = document.querySelectorAll('.menu-item');

// 菜单栏动画
function menuItemPosition() {
    menuItems.forEach((menuItem, index) => {
        const menu = menuItem.parentNode;
        const menuItemBottom = menu.offsetHeight - (index * 45 + 5 + 40);
    
        if (menuItemBottom < 5) {
            menuItem.style.top = '';
            menuItem.style.bottom = '5px';
        } else {
            menuItem.style.bottom = '';
            menuItem.style.top = String(index * 45 + 5) + 'px';
        }
    });
}

setInterval(menuItemPosition, 2);

// 初始化新建按钮响应功能
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
        trackEditor.dataset.beatNum = String(INIT_BEAT_NUM);
        trackEditor.dataset.noteNum = String(MAX_NOTE_NUM);
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

        id = parseInt(trackContainer.dataset.id, 10);
        const trackEditor = trackContainer.parentNode;

        // 删除音轨容器元素
        deleteTrackContainer(trackContainer);

        // 更新总音轨数量
        trackNum = parseInt(trackEditor.dataset.trackNum, 10);
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

// 播放所有音轨上的音乐
function fetchMusic() {
    sendMessage({
        type: 'fetch',
        option: 'fetch music'
    });
}

async function playMusic(music) {
    console.log('fff');
    const trackEditor = document.querySelector('.track-editor');
    console.log('222');
    const trackNum = parseInt(trackEditor.dataset.trackNum, 10);
    console.log('223');
    const beatNum = parseInt(trackEditor.dataset.beatNum, 10);
    console.log('224');
    const noteNum = parseInt(trackEditor.dataset.noteNum, 10);
    console.log('eee');
    console.log(trackNum, beatNum, noteNum);
    const beatDuration = 0.5;
    const offset = -10;
    for (let i = 0; i < beatNum; i++) {
        for (let j = 0; j < trackNum; j++) {
            for (let k = 0; k < noteNum; k++) {
                switch (music.tracks[j].beats[i].notes[k].instrument) {
                    case 'piano':
                        console.log('ddd');
                        playSound(pitchFrequancy(k + offset), beatDuration);
                        break;
                    default:
                        break;
                }
            }
        }
        await sleep(beatDuration * 1000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pitchFrequancy(n) {
    const referenceFrequency = 261.63; // 中央 C 的频率（单位：Hz）
    const semitoneRatio = Math.pow(2, 1/12); // 半音的频率比率

    // 计算从中央 C 向上两个半音的音高的频率
    // const n = 2; // 两个半音
    const frequency = referenceFrequency * Math.pow(semitoneRatio, n);

    return frequency;
}

function playSound(frequency, duration) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // 添加 gain 节点
    oscillator.type = "sine"; // 此处设置为正弦波

    oscillator.connect(gainNode); // 将振荡器连接到增益节点
    gainNode.connect(audioContext.destination); // 将增益节点连接到目标

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // 初始音量设置为 0
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.05); // 线性渐入到完整音量

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.05); // 线性渐出到静音
}


// 创建 WebSocket 连接
const socket = new WebSocket(`ws://${online ? onlineIP : offlineIP}:4333`);

// 当连接建立时
socket.onopen = function(event) {
    console.log("WebSocket connection established.");
};

function sendMessage(message) {
    const str = JSON.stringify(message);
    socket.send(str);
    console.log("Sent message:", message);
}

// 当收到消息时
socket.onmessage = function(event) {
    console.log("Received message:", event.data);

    try {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'music':
                playMusic(message.data)
                break;
            default:
                break;
        }
    } catch (error) {
    }
};
