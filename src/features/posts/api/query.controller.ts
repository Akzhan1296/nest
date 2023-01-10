import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/repository/comments.query.repository';
import { PaginationViewModel } from '../../../common/common-types';
import { CommentViewModel } from '../../comments/infrastructure/models/view.models';
import { PostViewModel } from '../infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { PostsQueryType } from './models/input.models';

@Controller('posts')
export class PostsQueryController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  async getPosts(
    @Query() pageSize: PostsQueryType,
  ): Promise<PaginationViewModel<PostViewModel>> {
    return await this.postsQueryRepository.getPosts(pageSize);
  }

  @Get(':id')
  async getPostById(@Param() params: { id: string }): Promise<PostViewModel> {
    const post = this.postsQueryRepository.getPostById(params.id);
    if (!post) throw new NotFoundException('post not found');
    return await this.postsQueryRepository.getPostById(params.id);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Query() pageSize: PostsQueryType,
    @Param() params: { postId: string },
  ): Promise<PaginationViewModel<CommentViewModel>> {
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (!post) throw new NotFoundException('post not found');
    return await this.commentsQueryRepository.getCommentsByPostId(
      pageSize,
      params.postId,
    );
  }
}
