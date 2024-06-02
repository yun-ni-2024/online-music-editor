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

// 获取保存弹窗容器
const saveModal = document.querySelector('.save-modal');

// 保存为已有文件
function saveFile() {
    console.log('In function \'saveFile\'');
    
    const tmpMusicId = getUrlParam('tmpMusicId');
    saveTmpMusic(tmpMusicId);

    // Show toast
    showToast('保存成功', 3000);
}

// Save current music as a new file
function saveFileAs() {
    console.log('In function \'saveFileAs\'');

    // 显示保存弹窗
    saveModal.style.display = "block";

    // 当点击关闭按钮时，隐藏保存弹窗
    const saveModelCloseBtn = document.querySelectorAll('.close')[0];
    saveModelCloseBtn.onclick = function() {
        saveModal.style.display = "none";
    };

    // 当用户点击其他地方时，隐藏保存弹窗
    window.onclick = function(event) {
        if (event.target == saveModal) {
            saveModal.style.display = "none";
        }
    };

    // 点击保存按钮时，保存为输入的文件名
    const saveBtn = document.getElementById('saveButton');
    saveBtn.addEventListener('click', function() {
        // 获取用户 id 和文件名
        const uid = localStorage.getItem('uid');
        const fileName = document.getElementById('saveFileName').value;
        
        // // 向后端发送消息，执行保存操作
        // sendMessage({
        //     type: 'file',
        //     option: 'save file as',
        //     uid: uid,
        //     fileName: fileName
        // });
        const tmpMusicId = getUrlParam('tmpMusicId');
        saveTmpMusicAs(tmpMusicId, uid, fileName);

        // 更新当前音乐文件状态
        const trackEditor = document.querySelector('.track-editor');
        trackEditor.dataset.isNew = 'false';

        // Hide save modal
        saveModal.style.display = "none";

        // Show toast
        showToast('保存成功', 3000);
    });
}

export {
    saveFile,
    saveFileAs
};
