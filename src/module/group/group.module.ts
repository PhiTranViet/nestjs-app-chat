import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupGateway } from './group.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Post,
  User,
  Chat,
  Group,
  Message,
  UserChat,
  UserGroup,
} from '../../database/entities';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../common/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      Chat,
      Group,
      Message,
      UserChat,
      UserGroup,
    ]),
    AuthModule,
    RabbitMQModule
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupGateway, AuthService],
})
export class GroupModule {}
