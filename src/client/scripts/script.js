/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let clientID = +localStorage.getItem('clientID');

if (!clientID) {
    clientID = Math.random();
    localStorage.setItem('clientID', String(clientID));
}

let scrollElement = document.getElementById('chat-body');

function openChat() {
    scrollElement.scrollTop = scrollElement.scrollHeight;

    document.getElementById('chat-open').style.opacity = 0;

    document.getElementById('chat').style.opacity = 1;
    document.getElementById('chat').style.transform = 'scale(1)';
}

function closeChat() {
    document.getElementById('chat-open').style.opacity = 1;

    document.getElementById('chat').style.opacity = 0;
    document.getElementById('chat').style.transform = 'scale(0.9)';
}

function last(array) {
    return array[array.length - 1];
}

function formatDate(date) {
    date = new Date(date);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function addMessage(message) {
    document.getElementById('messages').innerHTML += `
        <div class="chat-body_message-${message.isOut ? 'out' : 'in'}">
            <span class="chat-body_message-text">${message.text.replace(/\n/g, '</br>')}</span>
            <span class="chat-body_message-time">${formatDate(message.date)}</span>
        </div>
    `;
}

let localMessages = localStorage.getItem('messages');

if (localMessages) {
    for (const message of JSON.parse(localMessages)) {
        addMessage(message);
    }
}

const socket = io();

function sendMessage(event = null) {
    if (event && event.keyCode !== 13)
        return;

    const text = document.getElementById('message_text').value.trim();

    if (!text) return;
    
    socket.emit('message', { text, clientID });
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

console.log('ClientID:', clientID);