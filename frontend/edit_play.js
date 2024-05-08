const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost"
};

import {
    sendMessage
} from './message.js';

// 定义音符频率
const instruments = {
    piano: {
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.00,
        A4: 440.00,
        B4: 493.88
    },
    guitar: {
        E2: 82.41,
        A2: 110.00,
        D3: 146.83,
        G3: 196.00,
        B3: 246.94,
        E4: 329.63
    },
    violin: {
        G3: 196.00,
        D4: 293.66,
        A4: 440.00,
        E5: 659.25
    }
};

// 播放所有音轨上的音乐
function fetchMusic() {
    console.log('In function \'fetchMusic\'');

    sendMessage({
        type: 'fetch',
        option: 'fetch current music'
    });
}

async function playMusic(music) {
    console.log('In function \'playMusic\'');

    const trackEditor = document.querySelector('.track-editor');
    const trackNum = parseInt(trackEditor.dataset.trackNum, 10);
    const beatNum = parseInt(trackEditor.dataset.beatNum, 10);
    const noteNum = parseInt(trackEditor.dataset.noteNum, 10);
    console.log(trackNum, beatNum, noteNum);
    const beatDuration = 0.5;
    for (let i = 0; i < beatNum; i++) {
        for (let j = 0; j < trackNum; j++) {
            for (let k = 0; k < noteNum; k++) {
                if (music.tracks[j].beats[i].notes[k].instrument != 'none'){
                    playSound(music.tracks[j].beats[i].notes[k].instrument, k, beatDuration);
                }
            }
        }
        await sleep(beatDuration * 1000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 播放一个拍子
function playSound(instrument, pinch, duration) {
    const audio = new Audio('resource/audio/piano/C4.mp3');
    audio.play();
}

export {
    fetchMusic,
    playMusic
};
