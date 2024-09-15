var socket = require('socket.io-client')(process.env.SOCKET_URL || 'http://localhost:4000');

export class SocketService {
    async sendToSocket(data, event) {
        try {
            if (!socket.connected) {
                socket.connect();
            }

            console.log(`sendToSocket:: socket url: ${process.env.SOCKET_URL || 'http://localhost:4000'}`);
            console.log(`sendToSocket:: socket connected ${socket.connected}`);
            console.log(`sendToSocket:: socket id ${socket.id}`);

            socket.on('disconnect', (reason) => {
                console.log('sendToSocket::disconnect', reason)
                socket.connect();
                console.log(`sendToSocket:: socket connected ${socket.connected}`);
                console.log(`sendToSocket:: socket id ${socket.id}`);
            })

            socket.on('connect_error', (error) => {
                console.log('sendToSocket::connect_error', error)
                socket.connect();
                console.log(`sendToSocket:: socket connected ${socket.connected}`);
                console.log(`sendToSocket:: socket id ${socket.id}`);
            })

            socket.on('connect', () => {
                console.log(`sendToSocket:: socket connected ${socket.connected}`);
                console.log(`sendToSocket:: socket id ${socket.id}`);
            });

            socket.emit(event, {data});
        } catch (error) {
            console.log('sendToSocket::error', error)
        }
    }

    createSocketData(user, content, transaction) {
        return {
            user: user,
            content: content,
            transaction: transaction,
        }
    }
}
