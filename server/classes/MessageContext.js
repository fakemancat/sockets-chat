module.exports = class MessageContext {
    constructor(socket, text) {
        this.text = text;
        this.socket = socket;
        
        // Date
        const date = new Date();
        const minutes = String(date.getMinutes());
        this.date = `${date.getHours()}:${minutes.length === 1 ? `0${minutes}` : minutes}`;
    }

    resend() {
        this.socket.emit('message', {
            isOut: true,
            text: this.text,
            date: this.date,
            randomId: Math.random()
        });
    }

    send(text) {
        this.socket.emit('message', {
            isOut: false,
            text: text,
            date: this.date,
            randomId: Math.random()
        });
    }
};