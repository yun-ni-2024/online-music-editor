const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {
    User
} = require('./models');

// Map an email to the verification code
let tmpVrfyCodeDict = {};

// Generate authentication token
function generateAuthToken(user) {
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    return token;
}

const authRoutes = express.Router();

// Handle login requests
authRoutes.post('/login', async (req, res) => {
    console.log('Handling POST /auth/login');

    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email: email });

        // User does not exist
        if (!user) {
            return res.status(404).json({ error: 'User not exist' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(String(password), user.password);

        // Password wrong
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Password wrong' });
        }

        // Login successfully
        console.log('Authentication successful')

        // Generate token and send to the user
        const authToken = generateAuthToken(user);
        res.cookie('authToken', authToken, { httpOnly: true });
        return res.status(200).json({ success: 'Login successful', uid: user.email, authToken: authToken });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle register requests
authRoutes.post('/register', async (req, res) => {
    console.log('Handling POST /auth/register');

    const { email, password, vrfyCode } = req.body;

    // Check verification code
    if ((!email in tmpVrfyCodeDict) || vrfyCode != tmpVrfyCodeDict[email]) {
        return res.status(401).json({ error: 'Wrong verification code' });
    }

    // Check if the email has already been registered
    let existingUser = null;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingUser) {
        return res.status(402).json({ error: 'Email already registered' });
    }

    try {
        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email: email, password: hashedPassword });
        await newUser.save();
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Register successful
    delete tmpVrfyCodeDict.email;
    return res.status(201).json({ success: 'Registration successful' });
});

// Handle sending email requests
authRoutes.post('/send-code', async (req, res) => {
    console.log('Handling POST /auth/send-code');

    const { email } = req.body;

    try {
        // Configurate the email
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'Righ7house@outlook.com',
                pass: 'Hsnz_1628'
            }
        });

        // Generate random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Edit the email
        const mailOptions = {
            from: 'Righ7house@outlook.com',
            to: email,
            subject: 'Verification Code for Online Music Editor Registration',
            text: `Your verification code is: ${verificationCode}`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification code:', error);
                res.status(500).json({ error: 'Failed to send verification code' });
            } else {
                // Map the user email to the code
                tmpVrfyCodeDict[email] = String(verificationCode);

                console.log('Verification code sent:', info.response);
                res.status(200).json({ success: 'Verification code sent successfully' });
            }
        });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    authRoutes
};
