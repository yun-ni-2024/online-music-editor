import {
    config
} from './config.js';

import {
    sleep,
    getUrlParam
} from './package.js';

import {
    getTmpMusic,
    tmpMusicEditNote,
    tmpMusicDelTrack,
    removeTmpMusic
} from './tmp_music.js';

const INIT_BEAT_NUM = 75;
const MAX_NOTE_NUM = 36;

const pianoColor = '#99ccff';
const guitarColor = '#ffcc00';
const violinColor = '#ff99ff';
const bassColor = '#ff9933';
const drumColor = '#90ee90';
const keyColor = '#ab82ff';

const pinch = [
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'
];

// Initialize page
document.addEventListener("DOMContentLoaded", function() {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/edit' && pathWoParams != '/edit.html') {
        console.log('Not in edit page, skip.');
        return;
    }

    console.log('In function \'DOMContentLoaded\'')
    
    // // Check token
    // const authToken = localStorage.getItem('authToken');

    // if (authToken) {
    //     console.log('User is logged in');
    // } else {
    //     // Redirect to the login page
    //     console.log('User is not logged in');
    //     window.location.href = '/login';
    // }

    // Create track editor
    const content = document.getElementById('content');

    const trackEditor = document.createElement('div');
    trackEditor.classList.add('track-editor');
    trackEditor.dataset.trackNum = String(0);
    trackEditor.dataset.beatNum = String(INIT_BEAT_NUM);
    trackEditor.dataset.noteNum = String(MAX_NOTE_NUM);
    trackEditor.dataset.isNew = 'true';
    trackEditor.dataset.instrument = 'piano'

    content.appendChild(trackEditor);

    // Load current music file
    const tmpMusicId = getUrlParam('tmpMusicId');
    const tmpMusic = getTmpMusic(tmpMusicId);
    console.log('tmpMusic=', tmpMusic);
    InitCurrMusic(tmpMusic);
});

// Load current music information to page
function InitCurrMusic(currMusic) {
    console.log('In function \'initEditMusic\'');

    const trackEditor = document.querySelector('.track-editor');
    if (currMusic.fileId && currMusic.uid == localStorage.getItem('uid')) {
        trackEditor.dataset.isNew = 'false';
    }

    // Set the features of track editor
    const trackNum = currMusic.music.tracks.length;
    let beatNum = INIT_BEAT_NUM;
    let noteNum = MAX_NOTE_NUM;
    if (trackNum) {
        beatNum = currMusic.music.tracks[0].beats.length;
        noteNum = currMusic.music.tracks[0].beats[0].notes.length;
    }
    trackEditor.dataset.trackNum = String(trackNum);
    trackEditor.dataset.beatNum = String(beatNum);
    trackEditor.dataset.noteNum = String(noteNum);

    console.log(`trackNum = ${trackNum}, beatNum = ${beatNum}, noteNum = ${noteNum}`);

    // Add tracks, beats and notes
    for (let i = 0; i < trackNum; i++) {
        const trackContainer = createTrackContainer(beatNum, noteNum);
        trackContainer.dataset.id = String(i);
        trackEditor.appendChild(trackContainer);
        
        const track = currMusic.music.tracks[i];
        for (let j = 0; j < beatNum; j++) {
            for (let k = 0; k < noteNum; k++) {
                const note = track.beats[j].notes[k];
                const noteElement = trackContainer.querySelector('.track').querySelectorAll('.beat')[j].querySelectorAll('.note')[noteNum - 1 - k];
                switch (note.instrument) {
                    case 'none':
                        noteElement.dataset.instrument = 'none';
                        break;
                    case 'piano':
                        noteElement.dataset.instrument = 'piano';
                        noteElement.style.backgroundColor = pianoColor;
                        break;
                    case 'guitar':
                        noteElement.dataset.instrument = 'guitar';
                        noteElement.style.backgroundColor = guitarColor;
                        break;
                    case 'violin':
                        noteElement.dataset.instrument = 'violin';
                        noteElement.style.backgroundColor = violinColor;
                        break;
                    case 'bass':
                        noteElement.dataset.instrument = 'bass';
                        noteElement.style.backgroundColor = bassColor;
                        break;
                    case 'drum':
                        noteElement.dataset.instrument = 'drum';
                        noteElement.style.backgroundColor = drumColor;
                        break;
                    case 'key':
                        noteElement.dataset.instrument = 'key';
                        noteElement.style.backgroundColor = keyColor;
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

// Create track container
function createTrackContainer(beatNum, noteNum) {
    // Create track container
    const trackContainer = document.createElement('div');
    trackContainer.classList.add('track-container');
    trackContainer.dataset.editMode = 'false';

    // Add pinch bar
    const pinchBar = document.createElement('div');
    pinchBar.classList.add('pinch-bar');

    // Add corner
    const corner = document.createElement('div');
    corner.classList.add('corner');
    pinchBar.appendChild(corner);

    // Add pinch labels
    for (let i = 0; i < noteNum; i++) {
        const pinchLabel = document.createElement('div');
        pinchLabel.classList.add('pinch-label');
        pinchLabel.classList.add('centering');
        const trackEditor = document.querySelector('.track-editor');
        const noteNum = parseInt(trackEditor.dataset.noteNum);
        pinchLabel.textContent = pinch[noteNum - 1 - i];
        pinchBar.appendChild(pinchLabel);
    }

    trackContainer.appendChild(pinchBar);

    // Add track
    const track = createTrack(beatNum, noteNum);
    trackContainer.appendChild(track);

    // Add playback indicator
    const playbackIndicator = document.createElement('div');
    playbackIndicator.classList.add('playback-indicator');
    trackContainer.appendChild(playbackIndicator);

    // Add 'delete' button
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('button');
    switch (localStorage.getItem('language')) {
        case 'en':
            deleteButton.textContent = 'Delete';
            break;
        case 'zh':
            deleteButton.textContent = '删除';
            break;
        default:
            break;
    }

    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        if (trackContainer.dataset.editMode == 'false') {
            deleteTrackContainer(trackContainer);
        } else {
            closeTrackEdit(trackContainer);
        }
        
    });

    trackContainer.appendChild(deleteButton);

    return trackContainer;
}

// Create track
function createTrack(beatNum, noteNum) {
    // Create track element
    const track = document.createElement('div');
    track.classList.add('track');
    track.classList.add('hoverable');
    
    track.addEventListener('click', function(event) {
        event.stopPropagation();
        const trackContainer = track.parentElement;
        toggleTrackEdit(trackContainer);
    });

    // Add beats
    for (let i = 0; i < beatNum; ++i) {
        const beat = createBeat(i, noteNum);
        beat.dataset.id = String(i);
        track.appendChild(beat);
    }

    return track;
}

// Delete track container
function deleteTrackContainer(trackContainer) {
    const tmpMusicId = getUrlParam('tmpMusicId');
    const trackId = parseInt(trackContainer.dataset.id, 10);
    const trackEditor = trackContainer.parentNode;

    // Delete track container element
    trackContainer.remove();

    // Update total track number
    const trackNum = parseInt(trackEditor.dataset.trackNum, 10);
    trackEditor.dataset.trackNum = String(trackNum - 1);

    // Edit id of track containers after it
    for (let i = 0; i < trackEditor.children.length; i++) {
        const element = trackEditor.children[i];
        const elementId = parseInt(element.dataset.id, 10);
        if (element.classList.contains('track-container') && elementId > trackId) {
            element.dataset.id = String(elementId - 1);
        }
    }

    tmpMusicDelTrack(tmpMusicId, trackId);
}

// Toggle track container status to 'edit'
function toggleTrackEdit(trackContainer) {
    console.log('In function \'toggleTrackEdit\'');
    
    if (trackContainer.dataset.editMode == 'true') {
        return;
    }

    // Increase track height and remove hoverability
    const track = trackContainer.querySelector('.track');
    track.classList.remove('hoverable');
    track.style.height = '557px';

    // Increase time stamp height
    const timeStamps = track.querySelectorAll('.time-stamp');
    timeStamps.forEach(timeStamp => {
        timeStamp.style.height = '17px';
    })

    // Increase pinch bar height
    const pinchBar = trackContainer.querySelector('.pinch-bar');
    pinchBar.style.height = '557px';
    pinchBar.style.width = '20px';

    // Mark the track as 'edit mode' after fully opened
    sleep(500).then(() => {
        trackContainer.dataset.editMode = 'true';
    });

    // Change the delete button to close button
    const deleteButton = trackContainer.querySelector('.delete-button');
    switch (localStorage.getItem('language')) {
        case 'en':
            deleteButton.textContent = 'Close';
            break;
        case 'zh':
            deleteButton.textContent = '收回';
            break;
        default:
            break;
    }
}

// Close 'edit' mode of a track
function closeTrackEdit(trackContainer) {
    // Remove 'edit mode'
    trackContainer.dataset.editMode = 'false';

    // Decrease track height and add hoverability back
    const track = trackContainer.querySelector('.track');
    track.classList.add('hoverable');
    track.style.height = '100px';

    // Decrease time stamp height
    const timeStamps = track.querySelectorAll('.time-stamp');
    timeStamps.forEach(timeStamp => {
        timeStamp.style.height = '0px';
    })

    // Decrease pinch bar height
    const pinchBar = trackContainer.querySelector('.pinch-bar');
    pinchBar.style.height = '100px';
    pinchBar.style.width = '0px';

    // Change the close button to remove button
    const deleteButton = trackContainer.querySelector('.delete-button');
    switch (localStorage.getItem('language')) {
        case 'en':
            deleteButton.textContent = 'Delete';
            break;
        case 'zh':
            deleteButton.textContent = '删除';
            break;
        default:
            break;
    }
}

// Create beat
function createBeat(id, noteNum) {
    // Create beat element
    const beat = document.createElement('div');
    beat.classList.add('beat');

    // Add time stamp
    const timeStamp = document.createElement('div');
    timeStamp.classList.add('time-stamp');
    timeStamp.classList.add('centering');
    timeStamp.textContent = String(id + 1);
    timeStamp.style.height = '0px';
    beat.appendChild(timeStamp);

    // Add note
    for (let i = 0; i < noteNum; ++i) {
        const note = createNote();
        note.dataset.id = String(noteNum - 1 - i);
        beat.appendChild(note);
    }

    return beat;
}

// Create note
function createNote() {
    // Create note element
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.instrument = 'none';

    // Add listener to click event
    note.addEventListener('click', function() {
        const trackContainer = note.parentElement.parentElement.parentElement;
        if (trackContainer.dataset.editMode == 'true'){
            editNote(note);
        }
    });

    // Add listener to mouse enter event
    note.addEventListener('mouseenter', () => {
        const trackContainer = note.parentElement.parentElement.parentElement;
        if (trackContainer.dataset.editMode == 'true'){
            hoverNote(note);
        }
    });

    // Add listener to mouse leave event
    note.addEventListener('mouseleave', () => {
        const trackContainer = note.parentElement.parentElement.parentElement;
        if (trackContainer.dataset.editMode == 'true'){
            cancelHoverNote(note);
        }
    });

    return note;
}

// When mouse hovers over a note
function hoverNote(currNote) {
    console.log('In function \'hoverNote\'');

    const beat = currNote.parentElement;
    const track = beat.parentElement;
    const trackContainer = track.parentElement;
    const trackEditor = trackContainer.parentElement;

    const noteId = parseInt(currNote.dataset.id, 10);
    const noteNum = parseInt(trackEditor.dataset.noteNum, 10);

    // Add shadow effect to notes in the same column
    const notes = beat.querySelectorAll('.note');
    notes.forEach(note => {
        note.style.filter = 'brightness(95%)';
    });

    // Add shadow effect to notes in the same row
    const beats = track.querySelectorAll('.beat');
    beats.forEach(beat => {
        const notes = beat.querySelectorAll('.note');
        notes[noteNum - 1 - noteId].style.filter = 'brightness(95%)';
    })
    
    // Add shadow effect to current note
    currNote.style.filter = 'brightness(80%)';

    // Add shadow effect to corresponding time stamp
    const timeStamp = beat.querySelector('.time-stamp');
    timeStamp.style.filter = 'brightness(90%)';

    // Add shadow effect to corresponding pinch
    const pinchBar = trackContainer.querySelector('.pinch-bar');
    const pinchLabels = pinchBar.querySelectorAll('.pinch-label');
    pinchLabels[noteNum - 1 - noteId].style.filter = 'brightness(90%)';
}

// When mouse leaves a note
function cancelHoverNote(currNote) {
    console.log('In function \'cancelHoverNote\'');
    
    const beat = currNote.parentElement;
    const track = beat.parentElement;
    const trackContainer = track.parentElement;
    const trackEditor = trackContainer.parentElement;

    const noteId = parseInt(currNote.dataset.id, 10);
    const noteNum = parseInt(trackEditor.dataset.noteNum, 10);

    // Remove shadow effect from notes in the same column
    const notes = beat.querySelectorAll('.note');
    notes.forEach(note => {
        note.style.filter = '';
    });

    // Remove shadow effect from notes in the same row
    const beats = track.querySelectorAll('.beat');
    beats.forEach(beat => {
        const notes = beat.querySelectorAll('.note');
        notes[noteNum - 1 - noteId].style.filter = '';
    })
    
    // Remove shadow effect from corresponding time stamp
    const timeStamp = beat.querySelector('.time-stamp');
    timeStamp.style.filter = '';

    // Remove shadow effect from corresponding pinch label
    const pinchBar = trackContainer.querySelector('.pinch-bar');
    const pinchLabels = pinchBar.querySelectorAll('.pinch-label');
    pinchLabels[noteNum - 1 - noteId].style.filter = '';
}

// Edit the feature of a note
function editNote(note) {
    // Locate the note
    const noteId = parseInt(note.dataset.id, 10);
    const beat = note.parentNode;
    const beatId = parseInt(beat.dataset.id, 10);
    const trackContainer = beat.parentNode.parentNode;
    const trackId = parseInt(trackContainer.dataset.id, 10);

    const trackEditor = document.querySelector('.track-editor');

    if (note.dataset.instrument == trackEditor.dataset.instrument) {
        // Delete note feature
        note.dataset.instrument = 'none';
        note.style.backgroundColor = 'aliceblue';
    } else {
        // Add note feature
        note.dataset.instrument = trackEditor.dataset.instrument;

        switch (note.dataset.instrument) {
            case 'piano':
                note.style.backgroundColor = pianoColor;
                break;
            case 'guitar':
                note.style.backgroundColor = guitarColor;
                break;
            case 'violin':
                note.style.backgroundColor = violinColor;
                break;
            case 'bass':
                note.style.backgroundColor = bassColor;
                break;
            case 'drum':
                note.style.backgroundColor = drumColor;
                break;
            case 'key':
                note.style.backgroundColor = keyColor;
                break;
            default:
                console.error('Unknown instrument: ', note.dataset.instrument);
                break;
        }
    }

    // Update note in tmpMusic
    const tmpMusicId = getUrlParam('tmpMusicId');
    tmpMusicEditNote(tmpMusicId, trackId, beatId, noteId, note.dataset.instrument);
}

// Clear tmpMusic before closing the page
window.addEventListener('beforeunload', () => {
    const tmpMusicId = getUrlParam('tmpMusicId');
    removeTmpMusic(tmpMusicId);
});

export {
    createTrackContainer
}
