const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// CLIENT
app.get('/', (_, res) => (
    res.sendFile(`${__dirname}/client/index.html`)
));

app.use('/assets', express.static(`${__dirname}/client/assets`));
app.use('/styles', express.static(`${__dirname}/client/styles`));
app.use('/scripts', express.static(`${__dirname}/client/scripts`));

// SERVER
const io = SocketIO(server);

const MessageContext = require('./MessageContext');

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async(text) => {
        const context = new MessageContext(socket, text);
        context.resend();

        switch (context.text) {
            case 'привет':
                context.send('Ну привет, как дела?');
                break;
            default:
                break;
        }
    });
});

server.listen(8081);