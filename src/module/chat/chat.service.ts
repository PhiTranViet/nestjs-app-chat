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

  async sendMessage(
    chatId: number,
    userId: number,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });

    if (!chat) {
      throw Causes.DATA_INVALID;
    }

    const userChats = await this.usersChatsRepository.find({
      where: { chatId },
    });

    const messages = userChats.map((userChat) => {
      return this.messagesRepository.create({
        chatId: chat.id,
        content: sendMessageDto.content,
        type: sendMessageDto.type,
        userId: userChat.userId,
        isSender: userId == userChat.userId ? true : false,
        status: 'sent',
        sentAt: Date.now(),
      });
    });

    await this.messagesRepository.save(messages);
    return messages[0];
  }

  async getMessagesByChat(paginationOptions: IPaginationOptions, data: any) {
    const queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(Chat, 'c', 'message.chatId = c.id')
      .leftJoin(UserChat, 'uc', 'uc.chatId = message.chatId')
      .leftJoin(User, 'u', 'u.id = ug.userId')
      .select([
        'm.type as typeMessage',
        'm.content as content',
        'm.sent_at as sentAt',
        'm.status as status',
        'm.is_sender as isSender',
        'm.delivered_at as deliveredAt',
        'm.attachment_url as attachmentUrl',
        'u.username as username',
        'g.name as groupName',
      ])
      .where('message.chatId = :chatId', { chatId: data.chatId })
      .andWhere('message.userId = :userId', { userId: data.userId });

    const queryCount = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(Chat, 'c', 'message.chatId = c.id')
      .leftJoin(UserChat, 'uc', 'uc.chatId = message.chatId')
      .leftJoin(User, 'u', 'u.id = ug.userId')
      .select('Count (1) as total')
      .where('message.chatId = :chatId', { chatId: data.chatId })
      .andWhere('message.userId = :userId', { userId: data.userId });

    // Todo: Filter
    const messages = await queryBuilder.execute();
    const messagesCountList = await queryCount.execute();

    const { items, meta } = getArrayPaginationBuildTotal<Group>(
      messages,
      messagesCountList,
      paginationOptions,
    );

    return {
      results: items,
      pagination: meta,
    };
  }
  async deleteChat(chatId: number): Promise<{ message: string }> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw Causes.DATA_INVALID;
    }

    await this.chatsRepository.delete(chatId);

    return { message: 'Chat deleted successfully' };
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId, userId: userId },
    });

    if (!message) {
      throw Causes.DATA_INVALID;
    }

    message.status = 'read';
    message.seenAt = Date.now();
    await this.messagesRepository.save(message);

    return message;
  }

  async markAllMessagesAsRead(chatId: number, userId: number): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      where: { chatId, status: 'sent', userId: userId   }, // Only mark messages that are 'sent'
    });

    if (!messages.length) {
      throw Causes.DATA_INVALID;
    }

    messages.forEach(message => {
      message.status = 'read';
      message.seenAt = Date.now();
    });

    await this.messagesRepository.save(messages);

    return messages;
  }

}
