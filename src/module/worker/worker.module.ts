import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { RabbitMQModule } from '../common/rabbitmq/rabbitmq.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [RabbitMQModule, NotificationModule],
  providers: [WorkerService],
})
export class WorkerModule {}