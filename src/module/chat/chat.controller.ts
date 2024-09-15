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
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { CreateChatDto } from './request/create-chat.dto';
import { SendMessageDto } from './request/send-message.dto';



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
      return this.chatService.sendMessage(chatId, userId,sendMessageDto);
    }

}
