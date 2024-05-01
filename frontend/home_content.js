const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost",
    INIT_BEAT_NUM: 20,
    MAX_NOTE_NUM: 21
};

import {
    sendMessage
} from './message.js'

// 初始化
document.addEventListener("DOMContentLoaded", function() {
    
});

function fetchHomeMusic() {
    sendMessage({
        type: 'fetch',
        option: 'fetch all music desc'
    });
}

function initHomeMusic(musicDescs) {
    // 获取作品区域元素
    const works = document.querySelector('.works');

    // 添加所有作品
    musicDescs.forEach(musicDesc => {
        // 创建作品元素
        const work = document.createElement('div');
        work.classList.add('work');
        work.textContent = musicDesc.fileName;

        // 将作品元素添加到作品区域的最后
        works.appendChild(work);

        // 监听作品元素的点击事件
        newWork.addEventListener('click', () => {
            // window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/edit`;
        });
    });

    // 创建新建作品元素
    const newWork = document.createElement('div');
    newWork.classList.add('new-work');
    newWork.textContent = '新建作品';

    // 将新建作品元素添加到作品区域的最后
    works.appendChild(newWork);

    // 监听新建作品元素的点击事件
    newWork.addEventListener('click', () => {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/edit`;
    });
}

export {
    fetchHomeMusic,
    initHomeMusic
};
