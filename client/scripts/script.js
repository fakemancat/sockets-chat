/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function openChat() {
    document.getElementById('chat-open').style.opacity = 0;

    document.getElementById('chat').style.opacity = 1;
    document.getElementById('chat').style.transform = 'scale(1)';
}

function closeChat() {
    document.getElementById('chat-open').style.opacity = 1;

    document.getElementById('chat').style.opacity = 0;
    document.getElementById('chat').style.transform = 'scale(0.9)';
}

function addMessage(message) {
    if (message.isOut) {
        document.getElementById('messages').innerHTML += `
            <div class="chat-body_message-out">
                <span class="chat-body_message-time">${message.date}</span>
                <span class="chat-body_message-text">${message.text}</span>
            </div>
        `;
    } else {
        document.getElementById('messages').innerHTML += `
            <div class="chat-body_message-in">
                <span class="chat-body_message-text">${message.text}</span>
                <span class="chat-body_message-time">${message.date}</span>
            </div>
        `;
    }
}

let localMessages = localStorage.getItem('messages');

if (localMessages) {
    for (const message of JSON.parse(localMessages)) {
        addMessage(message);
    }
}

const socket = io('http://192.168.137.1:3000');
let scrollElement = document.getElementById('chat-body');

function sendMessage(event = null) {
    if (event && event.keyCode !== 13)
        return;

    const text = document.getElementById('message_text').value.trim();

    if (!text) return;
    
    socket.emit('message', text);
    document.getElementById('message_text').value = '';
}

socket.on('message', (data) => {
    addMessage(data);

    let localMessages = localStorage.getItem('messages');
    if (localMessages) {
        localMessages = JSON.parse(localMessages);
    } else {
        localMessages = [];
    }

    localStorage.setItem('messages', JSON.stringify([ ...localMessages, data ]));

    scrollElement.scrollTop = scrollElement.scrollHeight;
});