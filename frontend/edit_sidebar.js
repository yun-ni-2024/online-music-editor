import {
    config
} from './config.js';

import {
    createTrackContainer
} from './edit_content.js';

import {
    fetchMusic
} from './edit_play.js';

import {
    sendMessage
} from './message.js';

import {
    saveFile,
    saveFileAs
} from './edit_file.js';

import {
    getTmpMusic,
    tmpMusicNewTrack
} from './tmp_music.js';

import {
    getUrlParam
} from './package.js';

// Initialize
document.addEventListener("DOMContentLoaded", async function() {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/edit' && pathWoParams != '/edit.html') {
        console.log('Not in edit page, skip.');
        return;
    }

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

    // 设置乐器选项的点击事件
    const musicMenu = document.getElementById('music-menu');
    const instrumentButtons = musicMenu.querySelectorAll('.submenu-item');
    const instruments = ['piano', 'guitar', 'violin'];

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
        const trackContainer = createTrackContainer(beatNum, noteNum);

        // Update track ID and track number
        const trackId = parseInt(trackEditor.dataset.trackNum, 10)
        trackContainer.dataset.id = String(trackId);
        trackEditor.dataset.trackNum = String(trackId + 1);
        trackEditor.appendChild(trackContainer);

        console.log(`Add track, id = ${trackId}`);
        // Send message to backend to create a track
        // sendMessage({
        //     type: 'edit',
        //     option: 'new track',
        //     id: id,
        //     beatNum: beatNum,
        //     noteNum: noteNum
        // });

        const tmpMusicId = getUrlParam('tmpMusicId');
        tmpMusicNewTrack(tmpMusicId, trackId, beatNum, noteNum);
    });

    // Add event listener to 'play all'button
    const playAllButton = document.getElementById('play-all');

    playAllButton.addEventListener('click', function(){
        fetchMusic();
    });

    // Add event listener to 'save' button
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click',async  () => {
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

    // Add event listener to 'cowork' button
    const coworkButton = document.getElementById('cowork');
    coworkButton.addEventListener('click', async () => {
        try {
            const tmpMusicId = getUrlParam('tmpMusicId');
            const tmpMusic = getTmpMusic(tmpMusicId);
            const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/cowork`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tmpMusic })
            });

            const data = await response.json();
            console.log('Receiving response:', data);

            const port = data.port;
            window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:${port}`;
        } catch (error) {
            console.error('Error starting cowork:', error);
        }
    });

    // Add event listener to 'home' button
    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', function() {
        window.location.href = '/home?uid=' + localStorage.getItem('uid');
    });

    // Add event listener to 'gallery' button
    const galleryButton = document.getElementById('gallery');
    galleryButton.addEventListener('click', () => {
        window.location.href = '/gallery';
    });

    // Add event listener to 'switch account' button
    const switchAccountButton = document.getElementById('switch-account');
    switchAccountButton.addEventListener('click', () => {
        window.location.href = '/login';
    }); 
});
