let config;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        console.log('Load config: ', data);
    })
    .catch(error => console.error('Error loading configuration:', error));

import {
    sendMessage
} from './message.js';

const pinch = [
    'C4', 'C4s', 'D4', 'D4s', 'E4', 'F4', 'F4s', 'G4', 'G4s', 'A4', 'A4s', 'B4',
    'C5', 'C5s', 'D5', 'D5s', 'E5', 'F5', 'F5s', 'G5', 'G5s', 'A5', 'A5s', 'B5',
    'C6', 'C6s', 'D6', 'D6s', 'E6', 'F6', 'F6s', 'G6', 'G6s', 'A6', 'A6s', 'B6'
];

// Fetch current music
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

    const beatDuration = 0.25;
    const beatWidth = 18;
    
    const playbackIndicators = document.querySelectorAll('.playback-indicator');

    // Show the playback indicators
    playbackIndicators.forEach(playbackIndicator => {
        playbackIndicator.style.visibility = 'visible';
        playbackIndicator.style.transition = 'left 0.25s linear';
        console.log(playbackIndicator.style.visible, playbackIndicator.style.left, playbackIndicator.style.transition)
    });

    for (let i = 0; i < beatNum; i++) {
        // Play all notes at this beat
        for (let j = 0; j < trackNum; j++) {
            for (let k = 0; k < noteNum; k++) {
                if (music.tracks[j].beats[i].notes[k].instrument != 'none'){
                    playSound(music.tracks[j].beats[i].notes[k].instrument, k, beatDuration);
                }
            }
        }

        // Move all playback indicators to the next beat
        playbackIndicators.forEach(playbackIndicator => {
            playbackIndicator.style.left = String((i + 1) * beatWidth) + 'px';
            console.log(playbackIndicator.style.visible, playbackIndicator.style.left, playbackIndicator.style.transition)
        });

        // Highlight all note elements at this beat
        const tracks = trackEditor.querySelectorAll('.track');

        tracks.forEach(track => {
            const beats = track.querySelectorAll('.beat');
            const notes = beats[i].querySelectorAll('.note');

            notes.forEach(note => {
                if (note.dataset.instrument != 'none') {
                    note.style.filter = 'brightness(80%)';

                    // Remove highlight after this beat
                    setTimeout(() => {
                        note.style.filter = '';
                    }, beatDuration * 1000);
                }
            });
        });

        await sleep(beatDuration * 1000);
    }
    
    // Hide the playback indicators and move them back
    playbackIndicators.forEach(playbackIndicator => {
        playbackIndicator.style.transition = '';
        playbackIndicator.style.left = '0px';
        playbackIndicator.style.visibility = 'hidden';
        console.log(playbackIndicator.style.visible, playbackIndicator.style.left, playbackIndicator.style.transition)
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Play a note
function playSound(instrument, pinchId, duration) {
    const audioFilePath = 'resource/audio/' + instrument + '/' + pinch[pinchId] + '.mp3';
    console.log('Playing audio: ', audioFilePath);
    const audio = new Audio(audioFilePath);
    audio.play();
}

export {
    fetchMusic,
    playMusic
};
