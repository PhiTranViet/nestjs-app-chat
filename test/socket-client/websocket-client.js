// websocket-client.js
const io = require('socket.io-client');

// Kết nối đến WebSocket server
const socket = io('http://localhost:4000');

// Lắng nghe sự kiện 'notification'
socket.on('notification', (message) => {
  console.log('Received notification:', message);
});

// Đăng ký sự kiện 'connect' để biết khi nào client kết nối thành công
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  const userId = 1;  // Thay đổi ID người dùng tương ứng
  socket.emit('joinRoom', { userId });
});

// Đăng ký sự kiện 'disconnect' để biết khi nào client ngắt kết nối
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// Gửi tin nhắn đến server (tuỳ chọn)
socket.emit('test-message', { text: 'Hello from client' });