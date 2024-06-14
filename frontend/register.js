import {
    config
} from './config.js';

import {
    loadLanguage
} from './package.js';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('In function \'DOMContentLoaded\'')

    loadLanguage();

    const sendCodeBtn = document.getElementById('send-code-btn');
    const registerBtn = document.getElementById('register-btn');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const vrfyCodeInput = document.getElementById('verification-code');

    // When click 'send verification code' button
    sendCodeBtn.addEventListener('click', async function() {
        console.log('In function sendCodeBtn.click')

        const email = emailInput.value;

        if (!email) {
            emailInput.style.borderColor = 'red';
            emailInput.style.boxShadow = '0 0 5px red';
            return;
        }

        // Resort to backend to send verification code
        try {
            const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/auth/send-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert('Verification code has been sent, please check your mailbox');
            } else {
                alert('Fail to send verification code, please try again later');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // When clicking 'register' button
    registerBtn.addEventListener('click', async function(event) {
        console.log('In function \'registerBtn.click\'')

        const email = emailInput.value;
        const password = passwordInput.value;
        const vrfyCode = vrfyCodeInput.value;

        if (!email) {
            emailInput.style.borderColor = 'red';
            emailInput.style.boxShadow = '0 0 5px red';
            return;
        }

        if (!password) {
            passwordInput.style.borderColor = 'red';
            passwordInput.style.boxShadow = '0 0 5px red';
            return;
        }

        if (!vrfyCode) {
            vrfyCodeInput.style.borderColor = 'red';
            vrfyCodeInput.style.boxShadow = '0 0 5px red';
            return;
        }
        
        try {
            const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, vrfyCode })
            });
            
            if (response.ok) {
                // Register successfully, redirect to login page
                alert('Register successfully')
                window.location.href = '/login';
            } else {
                const errorMessage = await response.text();
                console.log('Error registering user:', errorMessage)
                
                switch (response.status) {
                    case 401:
                        alert('Wrong verification code');
                        break;
                    case 402:
                        alert('This email has already been registered');
                        break;
                    default:
                        alert('Unknown error');
                        break;
                }
            }
        } catch (error) {
            console.error('Error sending register post:', error.message);
        }
    });
});
