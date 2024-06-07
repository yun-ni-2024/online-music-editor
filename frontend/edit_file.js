import {
    config
} from './config.js';

import {
    sendMessage
} from './message.js';

import {
    showToast,
    getUrlParam
} from './package.js'

import {
    saveTmpMusicAs,
    saveTmpMusic
} from './tmp_music.js';

// Get the save modal element
const saveModal = document.querySelector('.save-modal');

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/edit' && pathWoParams != '/edit.html') {
        console.log('Not in edit page, skip.');
        return;
    }

    // When clicking the save button, save the file as the file name
    const saveBtn = document.getElementById('saveButton');
    saveBtn.addEventListener('click', async function() {
        // Get user ID and file name
        const uid = localStorage.getItem('uid');
        const fileName = document.getElementById('saveFileName').value;
        
        const tmpMusicId = getUrlParam('tmpMusicId');
        await saveTmpMusicAs(tmpMusicId, uid, fileName);

        // Update the status of current temporary music file
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.isNew = 'false';

        // Hide save modal
        saveModal.style.display = "none";

        // Show toast
        showToast('Saved', 3000);
    });
});

// Save existing file
async function saveFile() {
    console.log('In function \'saveFile\'');
    
    const tmpMusicId = getUrlParam('tmpMusicId');
    await saveTmpMusic(tmpMusicId);

    // Show toast
    showToast('Saved', 3000);
}

// Save current music as a new file
async function saveFileAs() {
    console.log('In function \'saveFileAs\'');

    // Show save modal
    saveModal.style.display = "block";

    // Hide the save modal when clicking the close button
    const saveModelCloseBtn = document.querySelectorAll('.close')[0];
    saveModelCloseBtn.onclick = function() {
        const fileName = document.getElementById('saveFileName').value;
        console.log(fileName);
        saveModal.style.display = "none";
    };

    // Hide the save modal when clicking other places
    window.onclick = function(event) {
        if (event.target == saveModal) {
            const fileName = document.getElementById('saveFileName').value;
            console.log(fileName);
            saveModal.style.display = "none";
        }
    };
}

// Delete a music file
async function deleteFile(fileId) {
    console.log('In function \'deleteFile\'');

    try {
        // Send message to backend server
        const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId })
        });

        const data = await response.json();
        console.log('Receiving response:', data)
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

export {
    saveFile,
    saveFileAs,
    deleteFile
};
