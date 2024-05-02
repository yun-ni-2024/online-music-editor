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
    const offset = -10;
    for (let i = 0; i < beatNum; i++) {
        for (let j = 0; j < trackNum; j++) {
            for (let k = 0; k < noteNum; k++) {
                switch (music.tracks[j].beats[i].notes[k].instrument) {
                    case 'piano':
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

export {
    fetchMusic,
    playMusic
};
