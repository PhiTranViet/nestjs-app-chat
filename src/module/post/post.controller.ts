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
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PostService } from './post.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { CreatePostDto } from './request/create-post.dto';
import { UpdatePostDto } from './request/update-post.dto';
import { PaginatedPostDto } from './request/paginated-post.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';


@ApiTags('post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'create post',
    description: 'create post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post created successfully',
    type: EmptyObjectBase,
  })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() request: any,
  ): Promise<EmptyObjectBase | EmptyObject> {
    const userId = request.user.id;
    return this.postService.createPost(createPostDto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'update post',
    description: 'update post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post updated successfully',
    type: EmptyObjectBase,
  })
  async updatePost(
    @Req() request: any,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = Number(request.user.id);
    return this.postService.updatePost(updatePostDto, id, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get post',
    description: 'get post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post retrieved successfully',
    type: EmptyObjectBase,
  })
  async getPost(@Req() request: any, @Param('id') id: number) {
    const userId = request.user.id;
    return this.postService.getPost(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'delete post',
    description: 'delete post',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Post deleted successfully',
  })
  async deletePost(@Req() request: any, @Param('id') id: number) {
    const userId = request.user.id;
    await this.postService.deletePost(id, userId);
    return { status: HttpStatus.NO_CONTENT };
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get posts with paging and filtering',
    description: 'Get list of posts with paging and filtering options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of posts retrieved successfully',
    type: PaginatedPostDto,
  })
  async getPosts(@Req() request: any, @Query() query: PaginatedPostDto) {
    const paginationOptions = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
    return this.postService.getPosts(paginationOptions, query);
  }
}
