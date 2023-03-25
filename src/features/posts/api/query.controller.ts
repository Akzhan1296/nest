import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/repository/comments.query.repository';
import { PaginationViewModel } from '../../../common/common-types';
import { UserIdGuard } from '../../../guards/userId';
import { CommentsQueryService } from '../../comments/api/query.service';
import { CommentViewModel } from '../../comments/infrastructure/models/view.models';
import { PostViewModel } from '../infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { PostsQueryType } from './models/input.models';

@Controller('posts')
export class PostsQueryController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsQueryService: CommentsQueryService,
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

  @UseGuards(UserIdGuard)
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Req() request: Request,
    @Query() pageSize: PostsQueryType,
    @Param() params: { postId: string },
  ): Promise<PaginationViewModel<CommentViewModel>> {
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (!post) throw new NotFoundException('post not found');

    const newResponse = await this.commentsQueryService.getCommentAll(
      pageSize,
      params.postId,
      request.body.userId,
    );

    return newResponse;

    // return await this.commentsQueryRepository.getCommentsByPostId(
    //   pageSize,
    //   params.postId,
    // );
  }
}
