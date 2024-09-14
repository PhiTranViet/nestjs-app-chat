import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities';
import { CreateUserDto } from './request/create-user.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {
  getArrayPagination,
  getArrayPaginationBuildTotal,
} from '../../shared/Utils';
import { Causes } from '../../config/exeption/causes';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(userId: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: Number(userId) },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await argon2.hash(password);

    const user = this.usersRepository.create({
      username: email,
      email: email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    return {
      email: user.email,
    };
  }

  async getListUser(paginationOptions: IPaginationOptions, data) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id as id',
        'user.username as username',
        'user.email as email',
        'user.created_at as createdAt',
        'user.updated_at as updatedAt',
      ]);

    const queryCount = this.usersRepository
      .createQueryBuilder('user')
      .select('Count (1) as total');
    if (data.username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${data.username}%`,
      });

      queryCount.andWhere('user.username LIKE :username', {
        username: `%${data.username}%`,
      });
    }
    if (data.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${data.email}%`,
      });

      queryCount.andWhere('user.email LIKE :email', {
        email: `%${data.email}%`,
      });
    }

    const users = await queryBuilder.execute();
    const usersCountList = await queryCount.execute();

    const { items, meta } = getArrayPaginationBuildTotal<User>(
      users,
      usersCountList,
      paginationOptions,
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw Causes.INTERNAL_ERROR;
    }
    return user;
  }
}
