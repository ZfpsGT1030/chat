// main.js

const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const userInput = document.getElementById('user');
const messages = document.getElementById('messages');

// Load history
socket.on('load messages', msgs => {
  msgs.forEach(addMessage);
});

// New message broadcast
socket.on('message', addMessage);

form.addEventListener('submit', e => {
  e.preventDefault();
  if (input.value && userInput.value) {
    socket.emit('new message', { user: userInput.value, text: input.value });
    input.value = '';
  }
});

function addMessage(msg) {
  const item = document.createElement('div');
  item.classList.add('message');
  const time = new Date(msg.timestamp).toLocaleTimeString();
  item.textContent = `[${time}] ${msg.user}: ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
