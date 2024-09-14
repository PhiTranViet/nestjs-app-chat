import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, User } from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post,User]),
    AuthModule
  ],
  controllers: [PostController],
  providers: [PostService,AuthService]
})
export class PostModule {}
