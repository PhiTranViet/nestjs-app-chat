import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { User } from '../../database/entities';
import { CreateUserDto } from './request/create-user.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {
  getArrayPagination,
} from "../../shared/Utils";
import { Causes } from '../../config/exeption/causes';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async findById(userId: number): Promise<User> {
    // Find user by ID
    return await this.userRepository.findOne({ where: { id: Number(userId) } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // Hash password before saving to database

    const user = this.userRepository.create({
      username,
      password: password,
    });

    return this.userRepository.save(user);
  }

  async getListUser( paginationOptions: IPaginationOptions, data){
    const { limit, page } = paginationOptions;

    const whereCondition: any = {};
    if (data.username) {
      whereCondition.username = data.username;
    }
    if (data.email) {
      whereCondition.email = data.email;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    const { items, meta } = getArrayPagination<User>(users, total, paginationOptions);
    return {
      results: items,
      pagination: meta,
    };
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: Number(id) } });
    if (!user) {
      throw Causes.INTERNAL_ERROR;
    }
    return user;
  }
}