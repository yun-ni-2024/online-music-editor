import {
    config
} from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('In function \'DOMContentLoaded\'')

    const sendCodeBtn = document.getElementById('send-code-btn');
    const registerBtn = document.getElementById('register-btn');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const vrfyCodeInput = document.getElementById('verification-code');

    sendCodeBtn.addEventListener('click', async function() {
        console.log('In function sendCodeBtn.click')

        // 获取邮箱输入框的值
        const email = emailInput.value;

        // 检查邮箱是否为空
        if (!email) {
            emailInput.style.borderColor = 'red';
            emailInput.style.boxShadow = '0 0 5px red';
            return;
        }

        // 发送邮箱给后端，请求验证码
        try {
            response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/auth/send-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert('验证码已发送，请检查你的邮箱');
            } else {
                alert('验证码发送失败，请稍后再试');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    registerBtn.addEventListener('click', async function(event) {
        console.log('In function \'registerBtn.click\'')

        // 获取输入框的值
        const email = emailInput.value;
        const password = passwordInput.value;
        const vrfyCode = vrfyCodeInput.value;

        // 检查邮箱是否为空
        if (!email) {
            emailInput.style.borderColor = 'red';
            emailInput.style.boxShadow = '0 0 5px red';
            return;
        }

        // 检查密码是否为空
        if (!password) {
            passwordInput.style.borderColor = 'red';
            passwordInput.style.boxShadow = '0 0 5px red';
            return;
        }

        // 检查验证码是否为空
        if (!vrfyCode) {
            vrfyCodeInput.style.borderColor = 'red';
            vrfyCodeInput.style.boxShadow = '0 0 5px red';
            return;
        }
        
        try {
            const response = await fetch(`http:/${config.online ? config.onlineIP : config.offlineIP}:3333/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, vrfyCode })
            });
            
            if (response.ok) {
                // 注册成功，重定向到登录页面
                alert('注册成功')
                window.location.href = '/login';
            } else {
                // 注册失败，处理错误信息
                const errorMessage = await response.text();
                console.log('Error registering user:', errorMessage)
                
                // 根据错误码判断错误类型
                switch (response.status) {
                    case 401:
                        alert('验证码错误，请重新输入');
                        break;
                    case 402:
                        alert('该邮箱已被注册');
                        break;
                    default:
                        alert('未知错误');
                        break;
                }
            }
        } catch (error) {
            console.error('Error sending register post:', error.message);
        }
    });
});
