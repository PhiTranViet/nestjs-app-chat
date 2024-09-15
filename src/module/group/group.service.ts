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
import { CreateGroupDto } from './request/create-group.dto';
import { SendMessageDto } from './request/send-message.dto';
import { AddMemberToGroupDto } from './request/add-member-to-group.dto';
import { UpdateGroupDto } from './request/update-group.dto';
import { RabbitMQService } from '../common/rabbitmq/rabbitmq.service';

@Injectable()
export class GroupService {
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

    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createGroupChat(createGroupDto: CreateGroupDto): Promise<Group> {
    const { name, description, isActive, roles } = createGroupDto;

    const group = new Group();
    group.name = name;
    group.isActive = isActive;
    group.description = description;
    const savedGroup = await this.groupsRepository.save(group);

    const userGroupEntries = roles.map((role) => {
      const userGroup = new UserGroup();
      userGroup.groupId = savedGroup.id;
      userGroup.userId = role.userId;
      userGroup.role = role.role;
      return userGroup;
    });

    await this.usersGroupsRepository.save(userGroupEntries);

    return savedGroup;
  }

  async sendMessageToGroup(
    groupId: number,
    userId: number,
    sendMessageToGroupDto: SendMessageDto,
  ): Promise<Message> {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw Causes.DATA_INVALID;
    }

    const userGroups = await this.usersGroupsRepository.find({
      where: { groupId },
    });

    if (!userGroups || userGroups.length === 0) {
      throw Causes.DATA_INVALID;
    }

    const messages = userGroups.map((userGroup) => {
      return this.messagesRepository.create({
        groupId: group.id,
        content: sendMessageToGroupDto.content,
        type: sendMessageToGroupDto.type,
        userId: userGroup.userId,
        isSender: userId == userGroup.userId ? true : false,
        status: 'sent',
        sentAt: Date.now(),
      });
    });

    await this.messagesRepository.save(messages);

    const messagesToQueue = messages.filter((message) => !message.isSender);
    if (messagesToQueue.length > 0) {
      await this.rabbitMQService.sendToQueue('group', messagesToQueue);
    }

    return messages.find((message) => message.isSender);
  }

  async getMembersInGroup(paginationOptions: IPaginationOptions, data: any) {
    const queryBuilder = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin(UserGroup, 'ug', 'ug.groupId = group.id')
      .leftJoin(User, 'u', 'u.id = ug.userId')
      .select([
        'group.name AS name',
        'group.is_active AS isActive',
        'group.description AS description',
        'ug.role AS role',
        'u.username as username',
      ]);

    const queryCount = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin(UserGroup, 'ug', 'ug.groupId = group.id')
      .leftJoin(User, 'u', 'u.id = ug.userId')
      .select('Count (1) as total');

    // Todo: Filter
    const members = await queryBuilder.execute();
    const membersCountList = await queryCount.execute();

    const { items, meta } = getArrayPaginationBuildTotal<Group>(
      members,
      membersCountList,
      paginationOptions,
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async getMessagesInGroup(paginationOptions: IPaginationOptions, data: any) {
    const queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(Group, 'g', 'message.groupId = g.id')
      .leftJoin(UserGroup, 'ug', 'ug.groupId = message.groupId')
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
      .where('message.groupId = :groupId', { groupId: data.groupId })
      .andWhere('message.userId = :userId', { userId: data.userId });

    const queryCount = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(Group, 'g', 'message.groupId = g.id')
      .leftJoin(UserGroup, 'ug', 'ug.groupId = message.groupId')
      .leftJoin(User, 'u', 'u.id = ug.userId')
      .select('Count (1) as total')
      .where('message.groupId = :groupId', { groupId: data.groupId })
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

  async addMemberToGroup(
    userId: number,
    groupId: number,
    addMemberDto: AddMemberToGroupDto,
  ): Promise<UserGroup> {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw Causes.DATA_INVALID;
    }

    const isAdmin = await this.checkIsAdminGroup(groupId, userId);
    if (!isAdmin) {
      throw Causes.DATA_INVALID;
    }

    const existingUserGroup = await this.usersGroupsRepository.findOne({
      where: { groupId, userId: addMemberDto.userId },
    });

    if (existingUserGroup) {
      throw Causes.DATA_INVALID;
    }

    const newUserGroup = this.usersGroupsRepository.create({
      groupId,
      userId: addMemberDto.userId,
      role: addMemberDto.role,
    });

    return await this.usersGroupsRepository.save(newUserGroup);
  }

  async removeMemberFromGroup(
    groupId: number,
    userId: number,
    userIdAuth: number,
  ): Promise<void> {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw Causes.DATA_INVALID;
    }

    const isAdmin = await this.checkIsAdminGroup(groupId, userIdAuth);
    if (!isAdmin) {
      throw Causes.DATA_INVALID;
    }

    const userGroup = await this.usersGroupsRepository.findOne({
      where: { groupId, userId },
    });

    if (!userGroup) {
      throw Causes.DATA_INVALID;
    }

    await this.usersGroupsRepository.remove(userGroup);
  }

  async updateGroup(
    groupId: number,
    userId: number,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const isAdmin = await this.checkIsAdminGroup(groupId, userId);
    if (!isAdmin) {
      throw Causes.DATA_INVALID;
    }

    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw Causes.DATA_INVALID;
    }

    Object.assign(group, updateGroupDto);

    return this.groupsRepository.save(group);
  }

  async deleteGroup(
    groupId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const isAdmin = await this.checkIsAdminGroup(groupId, userId);
    if (!isAdmin) {
      throw Causes.DATA_INVALID;
    }

    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw Causes.DATA_INVALID;
    }

    await this.groupsRepository.delete(groupId);

    return { message: 'Group deleted successfully' };
  }

  async leaveGroup(groupId: number, userId: number): Promise<void> {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw Causes.DATA_INVALID;
    }

    const userGroup = await this.usersGroupsRepository.findOne({
      where: { groupId, userId },
    });
    if (!userGroup) {
      throw Causes.DATA_INVALID;
    }

    const adminCount = await this.usersGroupsRepository.count({
      where: { groupId, role: 'admin' },
    });
    if (userGroup.role === 'admin' && adminCount === 1) {
      throw Causes.DATA_INVALID;
    }

    await this.usersGroupsRepository.remove(userGroup);
  }

  async checkIsAdminGroup(groupId: number, userId: number): Promise<boolean> {
    const roleUserGroup = await this.usersGroupsRepository.findOne({
      where: { groupId, userId: userId, role: 'admin' },
    });

    if (!roleUserGroup) {
      return false;
    }
    return true;
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

  async markAllMessagesAsRead(
    groupId: number,
    userId: number,
  ): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      where: { groupId, status: 'sent', userId: userId }, // Only mark messages that are 'sent'
    });

    if (!messages.length) {
      throw Causes.DATA_INVALID;
    }

    messages.forEach((message) => {
      message.status = 'read';
      message.seenAt = Date.now();
    });

    await this.messagesRepository.save(messages);

    return messages;
  }
}
