import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { RabbitMQService } from '../common/rabbitmq/rabbitmq.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {

    console.log('onModuleInit');
    await this.rabbitMQService.init();
    await this.rabbitMQService.consumeQueue(
      'chat',
      this.handleChatMessage.bind(this),
    );
    await this.rabbitMQService.consumeQueue(
      'group',
      this.handleGroupMessage.bind(this),
    );
  }

  private async handleChatMessage(message: any) {

    console.log('onChatMessage');
    console.log('message',message);

    await this.notificationService.sendNotification(
      message.userId,
      message.content,
    );
  }

  private async handleGroupMessage(message: any) {
    console.log('onChatMessage')
 
    console.log('message',message);

    await this.notificationService.sendNotification(
      message.userId,
      message.content,
    );
  }
}
