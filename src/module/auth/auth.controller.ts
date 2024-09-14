import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpStatus,
  Version
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { Register } from './request/register.dto';
import { RegisterResponse } from './response/register.dto';
import { RegisterBase } from './response/registerBase.dto';
import { Login } from './request/login.dto';
import { LoginResponse } from './response/login.dto';
import { LoginBase } from './response/loginBase.dto';
import { UpdatePassword } from './request/update-password.dto';
import { ResetPassword } from './request/reset-password.dto';
import { RefreshTokenDto } from './request/refresh-token.dto';
import RequestWithUser from '../../database/interfaces/requestWithUser.interface';
import { Causes } from '../../config/exeption/causes';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    operationId: 'register',
    summary: 'Register',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async register(
    @Body() data: Register,
  ): Promise<RegisterResponse | EmptyObject> {
    const duplicatedUser = await this.authService.checkDuplicatedUser(data);
    if (duplicatedUser) {
      throw Causes.DUPLICATE_EMAIL;
    }
    const user = await this.authService.registerUser(data);
    return user;
  }

  @Post('/login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginBase,
  })
  async login(@Body() data: Login): Promise<LoginResponse | EmptyObject> {
    const user = await this.authService.validateUser(data);
    if (!user) {
      throw Causes.EMAIL_OR_PASSWORD_INVALID;
    }
    return this.authService.login(user);
  }

  @Post('/update-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'update profile',
    summary: 'update profile',
    description: 'update profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async updatePassword(
    @Body() data: UpdatePassword,
    @Req() request: RequestWithUser,
  ): Promise<any | EmptyObject> {
    if (!request || !request.user) throw Causes.UNAUTHORIZED_ACCESS;

    if (data.oldPassword === data.newPassword) throw Causes.DUPLICATE_PASSWORD;

    const user = request.user;
    const userUpdate = await this.authService.updatePassword(user, data);

    if (!userUpdate) throw Causes.DATA_INVALID;

    return userUpdate;
  }

  @Post('/reset-password')
  @ApiOperation({
    operationId: 'reset password',
    summary: 'reset password',
    description: 'reset password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async resetPassword(@Body() data: ResetPassword): Promise<any | EmptyObject> {
    if (!data.password || !data.token) throw Causes.DATA_INVALID;

    const userUpdate = await this.authService.resetPassword(
      data.token,
      data.password,
    );

    if (!userUpdate) throw Causes.DATA_INVALID;

    return userUpdate;
  }

  @Post('/refresh-token')
  @ApiOperation({
    operationId: 'refresh-token',
    summary: 'Refresh token',
    description: 'Refresh the JWT token using a refresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginResponse,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse> {
    const newTokens = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return newTokens;
  }

  @Get('/info-user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'info user',
    summary: 'info user',
    description: 'Info user',
  })
  async getInfoUser(@Req() request: RequestWithUser) {
    if (!request || !request.user) throw Causes.DATA_INVALID;

    const user = await this.authService.getUserByUsername(
      request.user.username,
    );

    if (!user) throw Causes.DATA_INVALID;

    const { password, refreshToken, ...dataReturn } = user;

    return dataReturn;
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'logout',
    summary: 'Logout',
    description: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async logout(@Req() request: any): Promise<EmptyObject> {
    const token = request.headers.authorization;
    const userId = request.user.id;
    this.authService.logout(token, userId);
    return new EmptyObject();
  }
}
