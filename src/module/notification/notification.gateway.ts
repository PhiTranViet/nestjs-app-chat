import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(Number(process.env.SOCKET_PORT), { cors: true }) // Cổng WebSocket server
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { userId: number }) {
    const roomName = `user_${payload.userId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room ${roomName}`);
  }

  sendNotification(userId: number, message: string) {
    // this.server.to(`user_${userId}`).emit('notification', message);
    this.server.to(`user_1`).emit('notification', message);
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}