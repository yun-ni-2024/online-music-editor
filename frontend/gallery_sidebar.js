const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost"
};

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
