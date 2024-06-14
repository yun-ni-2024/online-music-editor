import {
    config
} from './config.js';

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
    
    // Check token
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        console.log('User is logged in');
    } else {
        // Redirect to login page
        console.log('User is not logged in');
        window.location.href = '/login';
    }

    const userName = document.getElementById('user-name');
    userName.textContent = getUrlParam('uid');

    // Get the works element
    const works = document.querySelector('.works');

    try {
        const uid = getUrlParam('uid');

        // Fetch all music description files from backend
        const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/home/?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Receiving response:', data);

        // Add all works
        data.musicDescs.forEach(musicDesc => {
            // Create work element
            const work = document.createElement('div');
            work.classList.add('work');
            work.textContent = musicDesc.fileName;
            works.appendChild(work);

            // When clicking the work
            work.addEventListener('click', async () => {
                try {
                    const fileId = musicDesc.fileId;
                    const uid = musicDesc.uid;

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
                    const tmpMusicId = loadMusicToTmp(music, fileId, uid);

                    // Switch to edit page
                    window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
                } catch (error) {
                    console.error('Error fetching file:', error);
                }
            });
        });

        if (localStorage.getItem('uid') == getUrlParam('uid')) {
            console.log('Creating new work');

            // Create 'new work' element
            const newWork = document.createElement('div');
            newWork.classList.add('new-work');
            switch (localStorage.getItem('language')) {
                case 'en':
                    newWork.textContent = 'New work';
                    break;
                case 'zh':
                    newWork.textContent = '新建作品';
                    break;
                default:
                    break;
            }
            
            works.appendChild(newWork);
    
            // When clicking 'new work'
            newWork.addEventListener('click', () => {
                // Create a new music file in local storage
                const tmpMusicId = newTmpMusic();
                
                // Switch to editing page
                window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
            });
        }

        works.querySelectorAll('.work, .new-work').forEach((work, index) => {
            setTimeout(() => {
                work.style.animation = `bounceUp 1s ease-out forwards`;
            }, index * 200); // Delay each element by 200ms
        });
    } catch (error) {
        console.error('Error initializing home:', error);
    }
});
