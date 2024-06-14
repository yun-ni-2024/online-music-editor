import {
    config
} from './config.js';

import {
    loadLanguage
} from './package.js';

// Initialize tha page
document.addEventListener("DOMContentLoaded", function() {
    loadLanguage(localStorage.getItem('language'));

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

    const joinButton = document.getElementById('join-button');
    joinButton.addEventListener('click', () => {
        const port = document.getElementById('cowork-id').value;

        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:${port}?uid=${localStorage.getItem('uid')}`;
    })

    // Add event listener to 'cowork' button
    const coworkButton = document.getElementById('cowork');
    coworkButton.addEventListener('click', () => {
        const coworkModal = document.querySelector('.cowork-modal');
        
        coworkModal.style.display = "block";

        const coworkModelCloseBtn = document.querySelectorAll('.close')[0];
        coworkModelCloseBtn.onclick = function() {
            coworkModal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == coworkModal) {
                coworkModal.style.display = "none";
            }
        };
    });

    // Add event listener to 'switch account' button
    const switchAccountButton = document.getElementById('switch-account');
    switchAccountButton.addEventListener('click', () => {
        window.location.href = '/login';
    });

    // Switching language
    const enButton = document.getElementById('en');
    const zhButton = document.getElementById('zh');
    enButton.addEventListener('click', () => {
        loadLanguage('en');
        localStorage.setItem('language', 'en');
    });
    zhButton.addEventListener('click', () => {
        loadLanguage('zh');
        localStorage.setItem('language', 'zh');
    });
});
