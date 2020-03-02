const express = require('express');

const app = express();

app.get('/', (_, res) => (
    res.sendFile(`${__dirname}/index.html`)
));

app.get('/index.html', (_, res) => (
    res.sendFile(`${__dirname}/index.html`)
));

app.get('/styles/style.css', (_, res) => (
    res.sendFile(`${__dirname}/styles/style.css`)
));

app.use('/assets', express.static(`${__dirname}/assets`));

app.listen(1337);