import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
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
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, AuthService],
})
export class ChatModule {}
