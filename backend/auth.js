const config = {
    online: false,
    onlineIP: "119.45.17.160",
    offlineIP: "localhost"
};

const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {
    User
} = require('./models');

// 记录邮箱对应的验证码
let tmpVrfyCodeDict = {};

// 生成认证令牌函数
function generateAuthToken(user) {
    // 生成JWT令牌
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    return token;
}

const authRoutes = express.Router();

// 解析请求体中的 JSON 数据
authRoutes.use(bodyParser.json());

// 处理登录请求
authRoutes.post('/auth/login', async (req, res) => {
    console.log('Handling POST /auth/login');

    const { email, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ email: email });

        // 用户不存在
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 验证密码
        const passwordMatch = await bcrypt.compare(String(password), user.password);

        // 密码错误
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // 登录成功
        console.log('Authentication successful')
        // 生成认证令牌并发送给客户端
        const authToken = generateAuthToken(user);
        res.cookie('authToken', authToken, { httpOnly: true });
        return res.status(200).json({ success: 'Login successful', uid: user.email, authToken: authToken });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// 处理注册请求
authRoutes.post('/auth/register', async (req, res) => {
    console.log('Handling POST /auth/register');

    const { email, password, vrfyCode } = req.body;

    // 检查验证码是否正确
    if ((!email in tmpVrfyCodeDict) || vrfyCode != tmpVrfyCodeDict[email]) {
        return res.status(401).json({ error: 'Wrong verification code' });
    }

    // 检查邮箱是否已经被注册
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
        // 创建新用户
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email: email, password: hashedPassword });
        await newUser.save();
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // 注册成功
    delete tmpVrfyCodeDict.email;
    return res.status(201).json({ success: 'Registration successful' });
});

// 处理发送邮件请求
authRoutes.post('/auth/send-code', async (req, res) => {
    console.log('Handling POST /auth/send-code');

    const { email } = req.body;

    try {
        // 配置发送邮件的邮箱
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'Righ7house@outlook.com',
                pass: 'Hsnz_1628'
            }
        });

        // 生成六位随机验证码
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // 邮件选项
        const mailOptions = {
            from: 'Righ7house@outlook.com',
            to: email,
            subject: 'Verification Code for Online Music Editor Registration',
            text: `Your verification code is: ${verificationCode}`
        };

        // 发送邮件
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification code:', error);
                res.status(500).json({ error: 'Failed to send verification code' });
            } else {
                // 将邮箱与验证码的对应关系存储进临时字典
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

// 在 home 页面路由中检查认证令牌
authRoutes.get('/home', (req, res) => {
    if (!req.cookies.authToken) {
        console.log('Redirected')
        res.redirect(`http://${config.online ? config.onlineIP : config.offlineIP}:2333/login`); // 重定向到登录页面
    } else {
        // 用户已经登录，渲染home页面
        res.render(`http://${config.online ? config.onlineIP : config.offlineIP}:2333/home`);
    }
});

// 在 edit 页面路由中检查认证令牌
authRoutes.get('/edit', (req, res) => {
    if (!req.cookies.authToken) {
        console.log('Redirected')
        res.redirect(`http://${config.online ? config.onlineIP : config.offlineIP}:2333/login`); // 重定向到登录页面
    } else {
        // 用户已经登录，渲染 edit 页面
        res.render(`http://${config.online ? config.onlineIP : config.offlineIP}:2333/edit`);
    }
});

// 导出路由
module.exports = {
    authRoutes
};
