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
import { CheckBanGuard } from '../../../guards/check-ban.guard';
import { PostViewModel } from '../infrastructure/repository/models/view.models';

@Controller('posts')
export class PostsQueryController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsQueryService: PostsQueryService,
    private readonly commentsQueryService: CommentsQueryService,
  ) {}

  @UseGuards(UserIdGuard)
  @Get()
  async getPosts(
    @Req() request: Request,
    @Query() pageSize: PostsQueryType,
  ): Promise<PaginationViewModel<PostViewModel>> {
    return await this.postsQueryService.getAllPostsWithLike(
      pageSize,
      request.body.userId,
    );
  }

  @UseGuards(UserIdGuard)
  // @UseGuards(CheckBanGuard)
  @Get(':id')
  async getPostById(
    @Req() request: Request,
    @Param() params: { id: string },
  ): Promise<PostViewModel> {
    const post = await this.postsQueryRepository.getPostById(params.id);
    if (!post) throw new NotFoundException('post not found');
    return await this.postsQueryService.getPostWithLikeById(
      params.id,
      request.body.userId,
    );
  }

  @UseGuards(UserIdGuard)
  @UseGuards(CheckBanGuard)
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
