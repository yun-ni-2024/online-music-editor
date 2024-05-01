const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost",
    INIT_BEAT_NUM: 20,
    MAX_NOTE_NUM: 21
};

import {
    sendMessage
} from './message.js';

// 获取保存弹窗容器
const saveModal = document.querySelector('.save-modal');

// 保存文件
function saveFile() {
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
        // 获取用户输入的文件名
        const fileName = document.getElementById('saveFileName').value;
        
        // 向后端发送消息，执行保存操作
        sendMessage({
            type: 'file',
            option: 'save file',
            fileName: fileName
        });
    });
}

export {
    saveFile
};
