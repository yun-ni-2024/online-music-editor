import {
    config
} from './config.js';

import {
    // sendMessage
} from './message.js';

import {
    newTmpMusic,
    loadMusicToTmp
} from './tmp_music.js';

import {
    getUrlParam
} from './package.js';

document.addEventListener("DOMContentLoaded", async function() {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/home' && pathWoParams != '/home.html') {
        console.log('Not in home page, skip.');
        return;
    }

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

    const userName = document.getElementById('user-name');
    userName.textContent = getUrlParam('uid');

    // 获取作品区域元素
    const works = document.querySelector('.works');

    try {
        const uid = getUrlParam('uid');
        const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/home/?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Receiving response:', data);

        // 添加所有作品
        data.musicDescs.forEach(musicDesc => {
            // 创建作品元素
            const work = document.createElement('div');
            work.classList.add('work');
            work.textContent = musicDesc.fileName;

            // 将作品元素添加到作品区域的最后
            works.appendChild(work);

            // 监听作品元素的点击事件
            work.addEventListener('click', async () => {
                try {
                    const fileId = musicDesc.fileId;

                    // Fetch music from database
                    const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/fetch`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ fileId })
                    });
                    
                    const data = await response.json();
                    console.log('Receiving response:', data);

                    const music = data.music;

                    // Load music to TmpMusic
                    const tmpMusicId = loadMusicToTmp(music, fileId, localStorage.getItem('uid'));

                    // Switch to edit page
                    window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
                } catch (error) {
                    console.error('Error fetching file:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error initializing home:', error);
    }

    if (localStorage.getItem('uid') == getUrlParam('uid')) {
        // 创建新建作品元素
        const newWork = document.createElement('div');
        newWork.classList.add('new-work');
        newWork.textContent = '新建作品';

        // 将新建作品元素添加到作品区域的最后
        works.appendChild(newWork);

        // 监听新建作品元素的点击事件
        newWork.addEventListener('click', () => {
            // // 清空 tmpMusic
            // sendMessage({
            //     type: 'edit',
            //     option: 'clear tmp music'
            // });

            const tmpMusicId = newTmpMusic();
            
            // 跳转到编辑页面
            window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
        });
    }
});
