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

    const messages = userGroups.map(userGroup => {
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

    return messages[0];
  }

  async getMembersInGroup(paginationOptions: IPaginationOptions, data: any) {
    const queryBuilder = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoin(UserGroup,'ug','ug.groupId = group.id')
      .leftJoin(User,'u','u.id = ug.userId')
      .select([
        'group.name AS name',
        'group.is_active AS isActive',
        'group.description AS description',
        'ug.role AS role',
        'u.username as username'
      ]);

    const queryCount = this.groupsRepository
    .createQueryBuilder('group')
    .leftJoin(UserGroup,'ug','ug.groupId = group.id')
    .leftJoin(User,'u','u.id = ug.userId')
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
      .leftJoinAndSelect(Group,'g', 'message.groupId = g.id')
      .leftJoin(UserGroup,'ug','ug.groupId = message.groupId')
      .leftJoin(User,'u','u.id = ug.userId')
      .select([
        'm.type as typeMessage',
        'm.content as content',
        'm.sent_at as sentAt',
        'm.status as status',
        'm.is_sender as isSender',
        'm.delivered_at as deliveredAt',
        'm.attachment_url as attachmentUrl',
        'u.username as username',
        'g.name as groupName'
      ])
      .where('message.groupId = :groupId',{groupId:data.groupId})
      .andWhere('message.userId = :userId',{userId:data.userId});

      const queryCount = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect(Group,'g', 'message.groupId = g.id')
      .leftJoin(UserGroup,'ug','ug.groupId = message.groupId')
      .leftJoin(User,'u','u.id = ug.userId')
      .select('Count (1) as total')
      .where('message.groupId = :groupId',{groupId:data.groupId})
      .andWhere('message.userId = :userId',{userId:data.userId});


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

  async addMemberToGroup(){

  }

  async removeMemberFromGroup(){

  }

  async updateGroup(){

  }

  async deleteGroup(){

  }


}
