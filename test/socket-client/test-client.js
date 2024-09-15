const io = require('socket.io-client');
const socket = io('http://localhost:3002'); // Thay đổi port nếu cần

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('chat-message', (message) => {
  console.log('Received chat message:', message);
});

socket.on('notification', (message) => {
  console.log('Received chat message:', message);
});

socket.on('group-message', (message) => {
  console.log('Received group message:', message);
});

// Gửi tin nhắn đến server
socket.emit('test-message', { text: 'Hello from client' });