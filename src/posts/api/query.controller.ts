import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';

@Controller('posts')
export class PostsQueryController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  async getPosts() {
    return await this.postsQueryRepository.getPosts();
  }
  @Get(':id')
  async getPostById(@Param() params: { id: string }) {
    return await this.postsQueryRepository.getPostById(params.id);
  }
  @Get(':postId/comments')
  async getCommentsByPostId(@Param() params: { postId: string }) {
    return await this.commentsQueryRepository.getCommentsByPostId(
      params.postId,
    );
  }
}
