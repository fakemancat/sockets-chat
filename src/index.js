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

const commands = require('./commands');
const MessageContext = require('./MessageContext');

const questions = new Map();

io.on('connection', (socket) => {
    socket.on('message', async ({ text, clientID }) => {
        const context = new MessageContext(socket, text);
        context.resend();

        if (questions.has(clientID)) {
            questions.get(clientID)(context.text);
            questions.delete(clientID);
            return;
        }

        if (/помощ[ьб]?[ьб]?/i.test(context.text)) {
            const commandsList = commands.map(([name], i) => (
                `${i + 1}. ${name}`
            )).join('\n');

            context.send(`${commandsList}\n\nОтправьте номер вопроса в этот диалог`);

            return;
        }

        if (Number(context.text) === 4) {
            const localCommands = commands[3][1];
            const commandsList = localCommands.map(([name], i) => (
                `${i + 1}. ${name}`
            )).join('\n') + '\n0. Выйти из меню выбора';

            context.send(`${commandsList}\n\nОтправьте номер вопроса в этот диалог`);

            const answer = Number(await new Promise((res) => {
                questions.set(clientID, res);
                setTimeout(() => {
                    if (questions.has(clientID)) {
                        questions.get(clientID)(-1);
                        questions.delete(clientID);
                    }
                }, 10000);
            }));

            if (Number.isNaN(answer) || answer < -1 || answer > localCommands.length) {
                context.send(`Ответить нужно было числом от 0 до ${localCommands.length}`);

                return;
            }

            if (answer <= 0) {
                const commandsList = commands.map(([name], i) => (
                    `${i + 1}. ${name}`
                )).join('\n');
    
                context.send(
                    `${
                        answer === -1
                        ? 'Вы не успели ответить\n\n'
                        : ''
                    }${commandsList}\n\nОтправьте номер вопроса в этот диалог`
                );
            } else {
                const command = localCommands.find((_, i) => (
                    answer === (i + 1)
                ));
        
                if (command && command.length) {
                    context.send(command[1]);
                }
            }

            return;
        }

        const command = commands.find((_, i) => (
            Number(context.text) === (i + 1)
        ));

        if (command && command.length) {
            context.send(command[1]);

            return;
        }

        context.send('Для получения списка вопросов, напишите "Помощь"');
    });
});

server.listen(8081);