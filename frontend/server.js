const express = require('express');
const path = require('path');
const fs = require('fs');

const configFile = fs.readFileSync('config.json');
const config = JSON.parse(configFile);

const app = express();

// 配置静态文件服务，指定静态文件目录为当前目录
app.use(express.static(path.join(__dirname)));

// 使用动态路由加载不同的HTML文件
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `${page}.html`));
});

// 启动服务器，监听指定端口
const port = 2333;
app.listen(port, () => {
    console.log(`Frontend server is running on http://${config.online ? config.onlineIP : config.offlineIP}:${port}`);
});
