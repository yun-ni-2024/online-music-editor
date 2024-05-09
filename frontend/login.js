import {
    config
} from './config.js';

document.addEventListener("DOMContentLoaded", function() {
    console.log('In function \'DOMContentLoaded\'');
    
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // 阻止默认表单提交行为

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log(data)

            // 如果登录成功并且后端返回了认证令牌
            if (response.ok && data.authToken) {
                // 将用户信息、认证令牌存储到 localStorage 中
                localStorage.setItem('uid', data.uid);
                localStorage.setItem('authToken', data.authToken);

                // 重定向到用户的个人页面或其他需要登录的页面
                window.location.href = '/home';
            } else {
                // 登录失败，显示错误消息
                alert(data.error);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    });

    // 添加注册超链接
    document.getElementById('register-link').href = '/register';
});
