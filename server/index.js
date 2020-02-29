const io = require('socket.io')();

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (data) => {
        console.log('New message', data);
        if (data === 'привет') {
            socket.emit('message', 'Привет, как дела?');
        }
    });
});

io.listen(3000);