function showToast(message, duration) {
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 5px;
        z-index: 9999;
        transition: opacity 0.5s;
    `;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 500);
    }, duration);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return value;
}

export {
    showToast,
    sleep,
    getUrlParam
};
