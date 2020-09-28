module.exports = class MessageContext {
    constructor(socket, text) {
        this.text = text.trim();
        this.socket = socket;
        
        // Date
        // const date = new Date();
        // this.date = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        this.date = Date.now();
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