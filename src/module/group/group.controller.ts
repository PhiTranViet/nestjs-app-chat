import {
  Body,
  Controller,
  Get,
  Post,
  Put,
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
    return this.groupService.getMessagesInGroup(paginationOptions, {groupId:groupId,userId: userId,...query});
  }


}
