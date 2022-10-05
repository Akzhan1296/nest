import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';

@Controller('posts')
export class PostsQueryController {
  constructor(protected postsQueryRepository: PostsQueryRepository) {}
  @Get()
  async getPosts() {
    return await this.postsQueryRepository.getPosts();
  }
  @Get(':id')
  async getPostById(@Param() params: { id: ObjectId }) {
    return await this.postsQueryRepository.getPostById(params.id);
  }
  @Get(':id')
  async getCommentsByPostId(@Param() params: { id: ObjectId }) {
    return await [];
  }
}
