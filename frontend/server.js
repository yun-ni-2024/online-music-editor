const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `${page}.html`));
});

const port = 2333;
app.listen(port, () => {
    console.log(`Frontend server is running on port ${port}`);
});
