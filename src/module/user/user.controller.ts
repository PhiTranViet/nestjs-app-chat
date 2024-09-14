import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './request/create-user.dto';
import { RegisterResponse } from './response/register.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../../database/entities';
import { ListUserDto } from './request/list-user.dto';
import { ApiCommonResponsesList } from '../../config/decorators/api-common-responses-list.decorator';
import { ApiCommonResponses } from '../../config/decorators/api-common-responses.decorator';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'register user', description: 'register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterResponse,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('list-user')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get a paginated list of users',
  })
  @ApiCommonResponsesList()
  async getListUser(@Query() query: ListUserDto) {
    const paginationOptions = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
    return await this.userService.getListUser(paginationOptions, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user', description: 'Get a user' })
  @ApiCommonResponses()
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
