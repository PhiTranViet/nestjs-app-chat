import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../../database/entities/User.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { encrypt, convertToObject, parseTTL } from '../../shared/Utils';
import { LoginResponse } from './response/login.dto';
import { Register } from './request/register.dto';
import { Causes } from '../../config/exeption/causes';
import { RedisService } from '../../module/common/redis/redis.service';

var limitRequestLoginMap = new Map();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  //login
  async validateUser(data: any): Promise<any> {
    const user = await this.getUserByEmail(data.email);
    if (user && user.email && user.password) {
      const key = encrypt('Login-' + user.email);
      let dataCheck = limitRequestLoginMap.get(key)
        ? limitRequestLoginMap.get(key)
        : {};

      if (
        dataCheck.total &&
        dataCheck.total >= (parseInt(process.env.LIMIT_REQUEST) || 5)
      ) {
        if (
          dataCheck.timeRequest &&
          Date.now() - dataCheck.timeRequest <
            (parseInt(process.env.LIMIT_HOURS_BLOCK_REQUEST) || 4) *
              60 *
              60 *
              1000
        )
          return null;

        dataCheck.total = 0;
        dataCheck.timeRequest = Date.now();
        limitRequestLoginMap.set(key, dataCheck);
      }

      //verify hashed password and plain-password
      const isPassword = await argon2.verify(user.password, data.password);

      if (isPassword) {
        if (dataCheck.total) {
          limitRequestLoginMap.delete(key);
        }

        const { password, ...result } = user;
        return result;
      } else {
        if (dataCheck.total) {
          dataCheck.total += 1;
        } else {
          dataCheck.total = 1;
        }
        dataCheck.timeRequest = Date.now();
        limitRequestLoginMap.set(key, dataCheck);
      }
    }
    return null;
  }

  async checkDuplicatedUser(data: Register): Promise<any> {
    const duplicatedUser = await this.getUserByEmail(data.email);
    return duplicatedUser;
  }

  async registerUser(data: Register): Promise<any> {
    const hashedPassword = await argon2.hash(data.password);
    const user = await this._registerUser(data.email, hashedPassword);
    const tokens = await this.getTokens(user);
    return {
      email: user.email,
      ...tokens,
    };
  }

  async _registerUser(email: string, password: string) {
    let user = new User();
    await this.dataSource.transaction(async (transactional) => {
      user.email = email;
      user.username = email;
      user.password = password;

      user = await transactional.save(user);
    });

    return user;
  }

  async getTokens(user: User) {
    const payload = { username: user.username, time: Date.now() };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRED,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRED,
    });

    await this.redisService.setToken(
      user.id,
      accessToken,
      parseTTL(process.env.JWT_EXPIRED),
    );

    await this.usersRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = { username: user.username, userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRED,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRED,
    });

    await this.redisService.setToken(
      user.id,
      accessToken,
      parseTTL(process.env.JWT_EXPIRED),
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async updatePassword(user: User, data: any) {
    if (!user || !user.username || !data) return false;
    let dataUser = await this.getUserByUsername(user.username);
    if (!dataUser) return false;
    if (!dataUser.password) {
      throw Causes.DATA_INVALID;
    }
    const isPassword = await argon2.verify(dataUser.password, data.oldPassword);
    if (!isPassword) throw Causes.DATA_INVALID;

    const hashedNewPassword = await argon2.hash(data.newPassword);

    dataUser.password = hashedNewPassword;
    dataUser = await this.usersRepository.save(dataUser);

    const { password, refreshToken, ...dataReturn } = dataUser;

    return dataReturn;
  }

  async resetPassword(dataToken: string, dataPassword: string) {
    if (!dataToken) return false;

    const data = convertToObject(this.jwtService.decode(dataToken));

    if (
      !data ||
      !data.time ||
      Date.now() - data.time > parseInt(process.env.EXPRIRE_TIME_EMAIL_CODE)
    )
      return false;

    let user = await this.getUserByToken(dataToken);

    if (!user) return false;

    const hashedPassword = await argon2.hash(dataPassword);
    user.password = hashedPassword;
    user.refreshToken = null;
    user = await this.usersRepository.save(user);

    const { password, refreshToken, ...dataReturn } = user;

    return dataReturn;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const decoded = this.jwtService.verify(refreshToken);

    if (!decoded) {
      throw Causes.DATA_INVALID;
    }

    const user = await this.usersRepository.findOne({
      where: { username: decoded.username },
    });
    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw Causes.DATA_INVALID;
    }

    const tokens = await this.getTokens(user);
    return tokens;
  }

  async getUserByToken(token: string) {
    const data = convertToObject(this.jwtService.decode(token));

    if (
      !data ||
      !data.username ||
      !data.time ||
      Date.now() - data.time > parseInt(process.env.EXPRIRE_TIME_TOKEN)
    )
      return false;

    let user = await this.getUserByUsername(data.username);

    if (!user || !user.refreshToken || user.refreshToken !== token)
      return false;

    return user;
  }

  async logout(userId: number) {
    await this.redisService.deleteToken(Number(userId));
    await this.usersRepository.update(Number(userId), { refreshToken: null });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  isValidToken(token: string) {
    return this.jwtService.verify(token);
  }
}
