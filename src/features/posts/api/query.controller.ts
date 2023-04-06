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
import { PaginationViewModel } from '../../../common/common-types';
import { UserIdGuard } from '../../../guards/userId';
import { CommentsQueryService } from '../../comments/api/query.service';
import { CommentViewModel } from '../../comments/infrastructure/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { PostsQueryType } from './models/input.models';
import { PostsQueryService } from './posts.query.service';

@Controller('posts')
export class PostsQueryController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected postsQueryService: PostsQueryService,
    protected commentsQueryService: CommentsQueryService,
  ) {}

  @UseGuards(UserIdGuard)
  @Get()
  // : Promise<PaginationViewModel<PostViewModel>>
  async getPosts(@Req() request: Request, @Query() pageSize: PostsQueryType) {
    return await this.postsQueryService.getAllPostsWithLike(
      pageSize,
      request.body.userId,
    );
  }

  @UseGuards(UserIdGuard)
  @Get(':id')
  // : Promise<PostViewModel>
  async getPostById(@Req() request: Request, @Param() params: { id: string }) {
    const post = await this.postsQueryRepository.getPostById(params.id);
    if (!post) throw new NotFoundException('post not found');
    return await this.postsQueryService.getPostWithLikeById(
      params.id,
      request.body.userId,
    );
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

    return await this.commentsQueryService.getCommentAll(
      pageSize,
      params.postId,
      request.body.userId,
    );
  }
}
