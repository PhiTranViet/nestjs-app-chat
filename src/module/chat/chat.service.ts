import { Injectable } from '@nestjs/common';
import { Causes } from '../../config/exeption/causes';
import {
  Post,
  User,
  Chat,
  Group,
  Message,
  UserChat,
  UserGroup,
} from '../../database/entities';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getArrayPaginationBuildTotal } from '../../shared/Utils';
import { CreateChatDto } from './request/create-chat.dto';
import { SendMessageDto } from './request/send-message.dto';



@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,

    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,

    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,

    @InjectRepository(UserChat)
    private usersChatsRepository: Repository<UserChat>,

    @InjectRepository(UserGroup)
    private usersGroupsRepository: Repository<UserGroup>,
  ) {}

  async createChat(
    createChatDto: CreateChatDto,
    userId: number,
  ): Promise<Chat> {
    const chat = new Chat();
    chat.name = createChatDto.name;
    chat.isGroup = createChatDto.isGroup ?? false;
    const chatData = await this.chatsRepository.save(chat);

    const userChats = [
      { chatId: chatData.id, userId: userId },
      { chatId: chatData.id, userId: createChatDto.chatUserIdTo },
    ].map((userChatData) => {
      const userChat = new UserChat();
      userChat.chatId = userChatData.chatId;
      userChat.userId = userChatData.userId;
      return userChat;
    });
    await this.usersChatsRepository.save(userChats);
    return chatData;
  }


  async sendMessage(chatId: number, userId: number, sendMessageDto: SendMessageDto): Promise<Message> {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });

    if (!chat) {
      throw Causes.DATA_INVALID;
    }

    const message = this.messagesRepository.create({
      chatId: chat.id,
      content: sendMessageDto.content,
      type: sendMessageDto.type,
      userId: userId,
      status: 'sent',
      sentAt: Date.now(),
    });

    return this.messagesRepository.save(message);
  }
}
