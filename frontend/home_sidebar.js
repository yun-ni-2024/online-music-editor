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
                menuItem.querySelector('.submenu').style.height = '150px';
                activeMenu.querySelector('.submenu').style.height = '0px';
                activeMenu = menuItem;
            }
        });
    });

    // 添加“我的空间”超链接
    menuItems[2].querySelector('.submenu').querySelectorAll('.submenu-item')[0].addEventListener('click', function() {
        window.location.href = `http://${config.online ? config.onlineIP : config.offlineIP}:2333/home`;
    })
});
