import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { PageSizeQueryModel } from 'src/common/common-types';
import { QueryParamsPipe } from 'src/common/query-param-pipes';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';

@Controller('posts')
export class PostsQueryController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  async getPosts(@Query(new QueryParamsPipe()) pageSize: PageSizeQueryModel) {
    return await this.postsQueryRepository.getPosts(pageSize);
  }

  @Get(':id')
  async getPostById(@Param() params: { id: string }) {
    const post = this.postsQueryRepository.getPostById(params.id);
    if (!post) throw new NotFoundException('post not found');
    return await this.postsQueryRepository.getPostById(params.id);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Query(new QueryParamsPipe()) pageSize: PageSizeQueryModel,
    @Param() params: { postId: string },
  ) {
    const post = this.postsQueryRepository.getPostById(params.postId);
    if (!post) throw new NotFoundException('post not found');
    return await this.commentsQueryRepository.getCommentsByPostId(
      pageSize,
      params.postId,
    );
  }
}
