const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost"
};

import {
    playMusic
} from './edit_play.js'

import {
    fetchHomeMusic,
    initHomeMusic
} from './home_content.js'

import {
    initEditPage,
    fetchOpenedMusic,
    loadEditMusic
} from './edit_content.js'

// 创建 WebSocket 连接
const socket = new WebSocket(`ws://${config.online ? config.onlineIP : config.offlineIP}:4333`);

// 当连接建立时
socket.onopen = function(event) {
    console.log('WebSocket connection established.');

    // 检查是否存在认证令牌
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // 用户已登录，可以执行相关操作，例如显示用户信息或访问受限资源
        console.log('User is logged in');

        const path = document.location.pathname;
        console.log('Path = ', path);

        // 判断当前是哪个页面
        switch (path) {
            case '/home':
            case '/home.html':
                fetchHomeMusic();
                break;
            case '/edit':
            case '/edit.html':
                initEditPage();
                fetchOpenedMusic();
                break;
            default:
                break;
        }
    }
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
                playMusic(message.data);
                break;
            case 'my music desc':
                initHomeMusic(message.data);
                break;
            case 'opened music':
                loadEditMusic(message.data);
            default:
                break;
        }
    } catch (error) {
    }
};

export {
    sendMessage
};
