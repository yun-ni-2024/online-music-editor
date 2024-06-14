import {
    config
} from './config.js';

import {
    socket,
    createTrackContainer
} from './cowork_content.js';

import {
    playMusic
} from './cowork_play.js';

import {
    saveFile,
    saveFileAs
} from './cowork_file.js';

import {
    getUrlParam,
    loadLanguage
} from './package.js';

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    loadLanguage(getUrlParam('lang'));

    const menuItems = document.querySelectorAll('.menu-item');
    let activeMenu = menuItems[0];
    const menu = document.querySelector('.menu')
    const totalHeight = menu.clientHeight;
    menuItems[0].querySelector('.submenu').style.height = String(totalHeight - (menuItems.length * 50 + 1)) + 'px';

    // Show submenus when mouse is hovering on the menu
    menuItems.forEach(menuItem => {
        menuItem.addEventListener('mouseover', function() {
            if (activeMenu != menuItem) {
                menuItem.querySelector('.submenu').style.height = String(totalHeight - (menuItems.length * 50 + 1)) + 'px';
                activeMenu.querySelector('.submenu').style.height = '0px';
                activeMenu = menuItem;
            }
        });
    });

    // Add listener to instrument buttons
    const musicMenu = document.getElementById('music-menu');
    const instrumentButtons = musicMenu.querySelectorAll('.submenu-item');
    const instruments = ['piano', 'guitar', 'violin', 'bass', 'drum', 'key'];

    let activeInstrumentButton = instrumentButtons[0];
    activeInstrumentButton.style.filter = 'brightness(85%)';

    instrumentButtons.forEach((instrumentButton, ind) => {
        instrumentButton.addEventListener('click', () => {
            if (activeInstrumentButton != instrumentButton) {
                const trackEditor = document.querySelector('.track-editor');
                trackEditor.dataset.instrument = instruments[ind];
                
                instrumentButton.style.filter = 'brightness(85%)';
                activeInstrumentButton.style.filter = '';
                activeInstrumentButton = instrumentButton;
            }
        });
    });

    // Add event listener to 'new track' button
    const newTrackBtn = document.getElementById('new-track');

    newTrackBtn.addEventListener('click', function(event) {
        event.stopPropagation();

        const trackEditor = document.querySelector('.track-editor');

        // Create track container
        const beatNum = parseInt(trackEditor.dataset.beatNum, 10);
        const noteNum = parseInt(trackEditor.dataset.noteNum, 10);
        const trackId = parseInt(trackEditor.dataset.trackNum, 10)
        const trackContainer = createTrackContainer(beatNum, noteNum);
        
        // Update track ID and track number
        trackContainer.dataset.id = String(trackId);
        trackEditor.dataset.trackNum = String(trackId + 1);
        trackEditor.appendChild(trackContainer);

        socket.emit('add track', {
            trackId,
            beatNum,
            noteNum
        });
    });

    socket.on('add track', (opt) => {
        console.log('Receive socket message: add track');

        const trackEditor = document.querySelector('.track-editor');

        // Create track container
        const beatNum = opt.beatNum;
        const noteNum = opt.noteNum;
        const trackContainer = createTrackContainer(beatNum, noteNum);

        // Update track ID and track number
        const trackId = opt.trackId;
        trackContainer.dataset.id = String(trackId);
        trackEditor.dataset.trackNum = String(trackId + 1);
        trackEditor.appendChild(trackContainer);

        console.log(`Add track, id = ${trackId}`);
    });

    // Add event listener to 'play all'button
    const playAllButton = document.getElementById('play-all');

    playAllButton.addEventListener('click', function() {
        socket.emit('fetch music to play');
    });

    // Add event listener to 'save' button
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', async  () => {
        const trackEditor = document.querySelector('.track-editor');
        if (trackEditor.dataset.isNew == 'true') {
            await saveFileAs();
        } else {
            await saveFile();
        }
    });

    // Add event listener to 'save as' button
    const saveAsButton = document.getElementById('save-as');
    saveAsButton.addEventListener('click', async () => {
        await saveFileAs();
    });

    // Add event listener to 'home' button
    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', function() {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/home?uid=${getUrlParam('uid')}`;
    });

    // Add event listener to 'gallery' button
    const galleryButton = document.getElementById('gallery');
    galleryButton.addEventListener('click', () => {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/gallery`;
    });

    // Add event listener to 'switch account' button
    const switchAccountButton = document.getElementById('switch-account');
    switchAccountButton.addEventListener('click', () => {
        window.location.href = '/login';
    }); 
});
