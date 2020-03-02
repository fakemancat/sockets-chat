const io = require('socket.io')();

const MessageContext = require('./classes/MessageContext');

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async(text) => {
        const context = new MessageContext(socket, text);
        context.resend();

        if (context.text === 'привет') {
            context.send('Ну привет, как дела?');
        }
    });
});

io.listen(3000);