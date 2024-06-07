import {
    config
} from './config.js';

// Create socket connection
const socket = new WebSocket(`ws://${config.online ? config.onlineIP : config.offlineIP}:4333`);

// When connection is built
socket.onopen = function(event) {
    console.log('WebSocket connection established.');

    // Check token
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        console.log('User is logged in');

        const path = document.location.pathname;
        console.log('Path = ', path);

        switch (path) {
            case '/home':
            case '/home.html':
                fetchHomeMusic();
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

// When receiving a message
socket.onmessage = function(event) {
    console.log("Received message:", event.data);

    try {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'music':
                // playMusic(message.data);
                break;
            case 'my music desc':
                loadHomeMusic(message.data);
                break;
            case 'opened music':
                // loadEditMusic(message.data);
            default:
                break;
        }
    } catch (error) {
    }
};

export {
    // sendMessage
};
