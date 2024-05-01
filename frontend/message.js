const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost",
    INIT_BEAT_NUM: 20,
    MAX_NOTE_NUM: 21
};

import {
    playMusic
} from './edit_play.js'

import {
    fetchHomeMusic,
    initHomeMusic
} from './home_content.js'

// 创建 WebSocket 连接
const socket = new WebSocket(`ws://${config.online ? config.onlineIP : config.offlineIP}:4333`);

// 当连接建立时
socket.onopen = function(event) {
    console.log("WebSocket connection established.");

    const path = document.location.pathname;

    // 判断当前是哪个页面
    switch (path) {
        case '/home':
        case '/home.html':
            fetchHomeMusic();
            break;
        default:
            break;
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
            case 'all music desc':
                initHomeMusic(message.data);
                break;
            default:
                break;
        }
    } catch (error) {
    }
};

export {
    sendMessage
};
