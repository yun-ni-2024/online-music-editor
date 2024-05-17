const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require("ws");
const bodyParser = require('body-parser');

const {
    authRoutes
} = require('./auth')

const {
    homeRoutes
} = require('./home')

const {
    fileRoutes
} = require('./file')

const {
    handleMessage
} = require('./message_handler');

const app = express();

// 添加 CORS 中间件，允许所有源的请求
app.use(cors());

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/auth', authRoutes);

app.use('/home', homeRoutes);

app.use('/file', fileRoutes);

// 启动服务器，监听指定端口
const port = 3333;
app.listen(port, () => {
    console.log(`Backend server is running on port :${port}`);
});

// 连接到 MongoDB 数据库
mongoose.connect(`mongodb://localhost:27017/online-music-editor`, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect(`mongodb://${config.online ? config.onlineIP : config.offlineIP}:27017/online-music-editor`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Connection to MongoDB failed:", error);
    });

// // 创建 WebSocket 服务器
// const wss = new WebSocket.Server({ port: 4333 });

// // 监听连接建立事件
// wss.on("connection", function connection(ws) {
//     console.log("WebSocket connection established.");

//     // 监听消息事件
//     ws.on("message", async function incoming(str) {
//         const message = JSON.parse(str);
//         console.log("Received message:", message);

//         // 发送响应消息
//         ws.send("Received by server.");
//         console.log("Sent message:", "Received by server.");

//         try {
//             // 对消息做出相应操作
//             const response = await handleMessage(message);
//             if (response.sendBack == 1) {
//                 const str = JSON.stringify(response.data);
//                 ws.send(str);
//                 console.log("Sent message:", response.data);
//             }
//         } catch (error) {
//             console.error('Error handling message:', error);
//         }
//     });
// });
