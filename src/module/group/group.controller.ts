import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Req,
  Query,
  Param,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { CreateGroupDto } from './request/create-group.dto';
import { SendMessageDto } from './request/send-message.dto';
import { PaginatedtDto } from './request/paginated.dto';
import { AddMemberToGroupDto } from './request/add-member-to-group.dto';
import { UpdateGroupDto } from './request/update-group.dto';

@Controller('groups')
@ApiTags('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'create chat',
    description: 'create chat',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'GroupChat created successfully',
    type: EmptyObjectBase,
  })
  async createGroupChat(
    @Body() createGroupDto: CreateGroupDto,
    @Req() request: any,
  ): Promise<EmptyObjectBase | EmptyObject> {
    const userId = request.user.id;
    createGroupDto.roles.push({ userId: userId, role: 'admin' });
    return this.groupService.createGroupChat(createGroupDto);
  }

  @Post(':groupId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Send a message to a chat',
    description: 'Send a message to a chat',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Send a message successfully',
    type: EmptyObjectBase,
  })
  async sendMessage(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() sendMessageDto: SendMessageDto,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.groupService.sendMessageToGroup(
      groupId,
      userId,
      sendMessageDto,
    );
  }

  @Get(':groupId/members')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the list of group members' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of members retrieved successfully',
    type: PaginatedtDto,
  })
  async getGroupMembers(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: PaginatedtDto,
  ) {
    const paginationOptions = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
    return this.groupService.getMembersInGroup(paginationOptions, query);
  }

  @Get(':groupId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a group iss message list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of posts retrieved successfully',
    type: PaginatedtDto,
  })
  async getGroupMessages(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: PaginatedtDto,
    @Req() request: any,
  ) {
    const paginationOptions = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
    const userId = request.user.id;
    return this.groupService.getMessagesInGroup(paginationOptions, {
      groupId: groupId,
      userId: userId,
      ...query,
    });
  }

  @Post(':groupId/members')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add member to group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add member to group successfully',
    type: PaginatedtDto,
  })
  async addMemberToGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() addMemberDto: AddMemberToGroupDto,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.groupService.addMemberToGroup(userId, groupId, addMemberDto);
  }

  @Delete(':groupId/members/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete member to group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete member to group successfully',
    type: PaginatedtDto,
  })
  async removeMemberFromGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: any,
  ) {
    const userIdAuth = request.user.id;
    return this.groupService.removeMemberFromGroup(groupId, userId, userIdAuth);
  }

  @Patch(':groupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete member to group successfully',
    type: PaginatedtDto,
  })
  async updateGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() request: any,
  ) {
    const userId = request.user.id;

    return this.groupService.updateGroup(groupId, userId, updateGroupDto);
  }

  @Delete(':groupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete group successfully',
  })
  async deleteGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.groupService.deleteGroup(groupId, userId);
  }

  @Post(':groupId/leave')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Leave group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave group successfully',
  })
  async leaveGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.groupService.leaveGroup(groupId, userId);
  }


  @Patch('messages/:messageId/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a specific message as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message marked as read',
  })
  async markMessageAsRead(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.groupService.markMessageAsRead(messageId, userId);
  }

  @Patch(':groupId/messages/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark all messages in a chat as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All messages in the chat marked as read',
  })
  async markAllMessagesAsRead(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() request: any,
  ) {
    const userId = request.user.id;

    return this.groupService.markAllMessagesAsRead(groupId,userId);
  }
}
