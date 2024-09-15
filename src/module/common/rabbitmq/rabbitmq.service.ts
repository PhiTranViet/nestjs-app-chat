import { Injectable, Inject } from '@nestjs/common';
import { Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channels: { [key: string]: Channel } = {};

  constructor(@Inject('RABBITMQ_CONNECTION') private readonly connection: Connection) {
    this.init();
  }

  async init() {
    try {
      this.channels['chat'] = await this.connection.createChannel();
      await this.channels['chat'].assertQueue('chat', { durable: true });

      this.channels['group'] = await this.connection.createChannel();
      await this.channels['group'].assertQueue('group', { durable: true });
    } catch (error) {
      console.error('Failed to initialize RabbitMQ channels:', error);
    }
  }

  async sendToQueue(queueName: string, message: any) {
    try {
      const channel = this.channels[queueName];
      if (channel) {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
      } else {
        console.error(`Channel ${queueName} does not exist`);
      }
    } catch (error) {
      console.error(`Failed to send message to ${queueName}:`, error);
    }
  }

  async consumeQueue(queueName: string, handler: (msg: any) => void) {
    try {
      const channel = this.channels[queueName];
      if (channel) {
        channel.consume(queueName, (msg) => {
          if (msg !== null) {
            handler(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          }
        });
      } else {
        console.error(`Channel ${queueName} does not exist`);
      }
    } catch (error) {
      console.error(`Failed to consume messages from ${queueName}:`, error);
    }
  }
}