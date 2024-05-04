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

document.addEventListener("DOMContentLoaded", function() {
    console.log('In function \'DOMContentLoaded\'')
    
    // 检查是否存在认证令牌
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // 用户已登录，可以执行相关操作，例如显示用户信息或访问受限资源
        console.log('User is logged in');
    } else {
        // 用户未登录，重定向到登录页面
        console.log('User is not logged in');
        window.location.href = '/login';
    }
});

function fetchHomeMusic() {
    const uid = localStorage.getItem('uid');
    sendMessage({
        type: 'fetch',
        option: 'fetch my music desc',
        uid: uid
    });
}

function initHomeMusic(musicDescs) {
    console.log('In function \'initHomeMusic\'')

    console.log('musicDescs:', musicDescs)

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
        work.addEventListener('click', () => {
            // 加载作品
            sendMessage({
                type: 'file',
                option: 'open my file',
                id: musicDesc.fileId
            });

            // 跳转到编辑页面
            window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/edit`;
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
        // 清空 tmpMusic
        sendMessage({
            type: 'edit',
            option: 'clear tmp music'
        });
        
        // 跳转到编辑页面
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/edit`;
    });
}

export {
    fetchHomeMusic,
    initHomeMusic
};
