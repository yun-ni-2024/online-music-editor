let config;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        console.log('Load config: ', data);
    })
    .catch(error => console.error('Error loading configuration:', error));

import {
    saveFile,
    saveFileAs
} from './edit_file.js';

// 初始化
document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.menu-item');
    let activeMenu = menuItems[0];
    menuItems[0].querySelector('.submenu').style.height = '150px';

    // 鼠标悬停在菜单项上时显示对应的子菜单
    menuItems.forEach(menuItem => {
        menuItem.addEventListener('mouseover', function() {
            if (activeMenu != menuItem) {
                const submenuNum = menuItem.querySelectorAll('.submenu-item').length;
                menuItem.querySelector('.submenu').style.height = String(submenuNum * 50) + 'px';
                activeMenu.querySelector('.submenu').style.height = '0px';
                activeMenu = menuItem;
            }
        });
    });

    // 设置乐器选项的点击事件
    const pianoButton = document.getElementById('piano');
    const guitarButton = document.getElementById('guitar');
    const violinButton = document.getElementById('violin');

    pianoButton.addEventListener('click', () => {
        // 切换到钢琴
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.instrument = 'piano';

        console.log('Instrument switched to piano');
    });

    guitarButton.addEventListener('click', () => {
        // 切换到吉他
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.instrument = 'guitar';

        console.log('Instrument switched to guitar');
    });

    violinButton.addEventListener('click', () => {
        // 切换到小提琴
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.instrument = 'violin';

        console.log('Instrument switched to violin');
    });

    // 添加保存按钮响应函数
    menuItems[1].querySelector('.submenu').querySelectorAll('.submenu-item')[1].addEventListener('click', () => {
        const trackEditor = document.querySelector('.track-editor');
        if (trackEditor.dataset.isNew == 'true') {
            saveFileAs();
        } else {
            saveFile();
        }
    });

    // Add event listener to 'save as' button
    const saveAsButton = document.getElementById('save-as');
    saveAsButton.addEventListener('click', () => {
        saveFileAs();
    });

    // Add event listener to 'home' button
    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', function() {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/home`;
    });

    // Add event listener to 'gallery' button
    const galleryButton = document.getElementById('gallery');
    galleryButton.addEventListener('click', () => {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/gallery`;
    });

    // Add event listener to 'switch account' button
    const switchAccountButton = document.getElementById('switch-account');
    switchAccountButton.addEventListener('click', () => {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/login`;
    }); 
});
