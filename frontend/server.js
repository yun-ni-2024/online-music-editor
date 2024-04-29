const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '';

    // 根据请求的 URL 路径来确定要返回的文件
    if (req.url === '/') {
        // 如果请求的是根路径，则返回 index.html 文件
        filePath = path.join(__dirname, 'index.html');
    } else {
        // 否则构造要返回的文件的完整路径
        filePath = path.join(__dirname, req.url);
    }

    // 读取文件内容
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 如果读取文件时发生错误，则返回 404 找不到文件响应
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            // 根据文件扩展名设置正确的 Content-Type
            let contentType = 'text/html';
            const ext = path.extname(filePath);
            if (ext === '.css') {
                contentType = 'text/css';
            } else if (ext === '.js') {
                contentType = 'text/javascript';
            }

            // 返回 200 OK 响应和文件内容
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const port = 2333;
server.listen(port, () => {
    console.log(`Frontend server is running on http://localhost:${port}`);
});
