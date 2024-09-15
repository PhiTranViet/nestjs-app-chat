import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { rabbitMQConfig } from '../../../config/rabbitmq.config';
@Module({
  providers: [
    RabbitMQService,
    {
      provide: 'RABBITMQ_CONNECTION',
      useFactory: async () => {
        const amqp = require('amqplib');
        return amqp.connect(rabbitMQConfig.uri);
      },
    },
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}