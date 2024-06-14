import {
    config
} from './config.js';

import {
    showToast,
    loadLanguage
} from './package.js'

// Initialize page
document.addEventListener("DOMContentLoaded", function() {
    console.log('In function \'DOMContentLoaded\'');

    loadLanguage();
    
    const loginForm = document.querySelector('form');

    // When clicking 'login'
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

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

            // If login successful
            if (response.ok && data.authToken) {
                // Save user information adn token to local storage
                localStorage.setItem('uid', data.uid);
                localStorage.setItem('authToken', data.authToken);

                // Redirect to home page
                window.location.href = '/home?uid=' + data.uid;
            } else {
                showToast(data.error, 3000);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    });

    // When clicking register button, redirect to the register page
    document.getElementById('register-link').href = '/register';
});
