import {
    config
} from './config.js';

import {
    showToast,
    getUrlParam
} from './package.js';

import {
    socket
} from './cowork_content.js';

// Get the save modal element
const saveModal = document.querySelector('.save-modal');

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    // When clicking the save button, save the file as the file name
    const saveBtn = document.getElementById('saveButton');
    saveBtn.addEventListener('click', async function() {
        // Get user ID and file name
        const fileName = document.getElementById('saveFileName').value;
        
        socket.emit('save file as', ({
            fileName
        }));

        // Update the status of current temporary music file
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.isNew = 'false';

        // Hide save modal
        saveModal.style.display = "none";

        // Show toast
        switch (getUrlParam('lang')) {
            case 'en':
                showToast('Saved', 3000);
                break;
            case 'zh':
                showToast('保存成功', 3000);
                break;
            default:
                break;
        }
    });

    socket.on('save file as', (opt) => {
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.isNew = 'false';
    });
});

// Save existing file
async function saveFile() {
    console.log('In function \'saveFile\'');
    
    socket.emit('save file');

    // Show toast
    switch (getUrlParam('lang')) {
        case 'en':
            showToast('Saved', 3000);
            break;
        case 'zh':
            showToast('保存成功', 3000);
            break;
        default:
            break;
    }
}

// Save current music as a new file
async function saveFileAs() {
    console.log('In function \'saveFileAs\'');

    // Show save modal
    saveModal.style.display = "block";

    // Hide the save modal when clicking the close button
    const saveModelCloseBtn = document.querySelectorAll('.close')[0];
    saveModelCloseBtn.onclick = function() {
        saveModal.style.display = "none";
    };

    // Hide the save modal when clicking other places
    window.onclick = function(event) {
        if (event.target == saveModal) {
            saveModal.style.display = "none";
        }
    };
}

export {
    saveFile,
    saveFileAs
};
