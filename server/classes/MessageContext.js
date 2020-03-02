module.exports = class MessageContext {
    constructor(socket, text) {
        const date = new Date();
        
        this.text = text;
        this.socket = socket;
        this.date = `${date.getHours()}:${date.getMinutes()}`;
    }

    resend() {
        this.socket.emit('message', {
            isOut: true,
            text: this.text,
            date: this.date
        });
    }

    send(text) {
        this.socket.emit('message', {
            isOut: false,
            text: text,
            date: this.date
        });
    }
};