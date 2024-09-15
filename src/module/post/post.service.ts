import { Injectable } from '@nestjs/common';
import { Causes } from '../../config/exeption/causes';
import { Post, User } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './request/create-post.dto';
import { UpdatePostDto } from './request/update-post.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getArrayPaginationBuildTotal } from '../../shared/Utils';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    let post = new Post();
    post.authorId = userId;
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    return this.postsRepository.save(post);
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    id: number,
    userId: number,
  ): Promise<Post> {
    const post = await this.postsRepository.preload({
      id,
      ...updatePostDto,
    });

    if (!post) {
      throw Causes.DATA_INVALID;
    }

    this.checkOwnership(post, userId);

    return this.postsRepository.save(post);
  }

  async getPost(id: number, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, authorId: userId },
    });
    if (!post) {
      throw Causes.NOT_AUTH;
    }
    return post;
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id, authorId: userId },
    });
    if (!post) {
      throw Causes.NOT_AUTH;
    }
    await this.postsRepository.remove(post);
  }

  async getPosts(paginationOptions: IPaginationOptions, data: any) {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoin(User, 'u', 'u.id = post.author_id')
      .select([
        'post.id AS id',
        'post.title AS title',
        'post.content AS content',
        'post.author_id AS authorId',
        'post.created_at AS createdAt',
        'post.updated_at AS updatedAt',
        'u.username AS username',
      ]);

    const queryCount = this.postsRepository
      .createQueryBuilder('post')
      .leftJoin(User, 'u', 'u.id = post.author_id')
      .select('Count (1) as total');

    if (data.content) {
      queryBuilder.andWhere('post.content LIKE :content', {
        content: `%${data.content}%`,
      });
      queryCount.andWhere('post.content LIKE :content', {
        content: `%${data.content}%`,
      });
    }
    if (data.title) {
      queryBuilder.andWhere('post.title LIKE :title', {
        title: `%${data.title}%`,
      });
      queryCount.andWhere('post.title LIKE :title', {
        title: `%${data.title}%`,
      });
    }
    if (data.authorName) {
      queryBuilder.andWhere('u.username LIKE :username', {
        username: `%${data.authorName}%`,
      });
      queryCount.andWhere('u.username LIKE :username', {
        username: `%${data.authorName}%`,
      });
    }

    const posts = await queryBuilder.execute();
    const postsCountList = await queryCount.execute();

    const { items, meta } = getArrayPaginationBuildTotal<Post>(
      posts,
      postsCountList,
      paginationOptions,
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  private checkOwnership(post: Post, userId: number): void {
    if (post.authorId !== userId) {
      throw Causes.NOT_AUTH;
    }
  }
}
