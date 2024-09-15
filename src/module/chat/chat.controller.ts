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
import { ChatService } from './chat.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { CreateChatDto } from './request/create-chat.dto';
import { SendMessageDto } from './request/send-message.dto';
import { PaginatedtDto } from './request/paginated.dto';

@ApiTags('chat')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'create chat',
    description: 'create chat',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Chat created successfully',
    type: EmptyObjectBase,
  })
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() request: any,
  ): Promise<EmptyObjectBase | EmptyObject> {
    const userId = request.user.id;
    return this.chatService.createChat(createChatDto, userId);
  }

  @Post(':chatId/messages')
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
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() sendMessageDto: SendMessageDto,
    @Req() request: any,
  ) {
    const userId = request.user.id;
    return this.chatService.sendMessage(chatId, userId, sendMessageDto);
  }

  @Get(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the list of messages in a chat' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of messages',
    type: PaginatedtDto,
  })
  async getMessagesByChat(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: PaginatedtDto,
    @Req() request: any,
  ) {
    const paginationOptions = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
    const userId = request.user.id;
    return this.chatService.getMessagesByChat(paginationOptions, {
      chatId: chatId,
      userId: userId,
      ...query,
    });
  }

  @Delete(':chatId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete Chat' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete chat successfully',
  })
  async deleteGroup(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Req() request: any,
  ) {
    return this.chatService.deleteChat(chatId);
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
    return this.chatService.markMessageAsRead(messageId, userId);
  }

  @Patch(':chatId/messages/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark all messages in a chat as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All messages in the chat marked as read',
  })
  async markAllMessagesAsRead(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Req() request: any,
  ) {
    const userId = request.user.id;

    return this.chatService.markAllMessagesAsRead(chatId,userId);
  }
}
