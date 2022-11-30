import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from 'src/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { CommentViewModel } from 'src/comments/infrastructure/models/view.models';
import { PostsService } from '../application/posts.service';
import { PostViewModel } from '../infrastructure/repository/models/view.models';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { CreateCommentInputModel, PostInputModel } from './models/input.models';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService.name)
    protected postService: PostsService,
    protected postQuerysRepository: PostsQueryRepository,
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() postsInputModel: PostInputModel,
  ): Promise<PostViewModel> {
    const post = await this.postService.createPost(postsInputModel);
    const viewModel = this.postQuerysRepository.getPostById(
      post._id.toString(),
    );
    return viewModel;
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param() params: { id: string },
    @Body() postsInputModel: PostInputModel,
  ) {
    this.postService.updatePost(params.id, postsInputModel);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param() params: { id: string }) {
    this.postService.deletePost(params.id);
    return;
  }

  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentForSelectedPost(
    @Param() params: { postId: string },
    @Body() commentInputModel: CreateCommentInputModel,
  ): Promise<CommentViewModel> {
    const userId = 'userId'; // from JWT

    const comment = await this.commentsService.createCommentForSelectedPost({
      postId: params.postId,
      userId,
      content: commentInputModel.content,
    });
    return await this.commentsQueryRepository.getCommentById(
      comment._id.toString(),
    );
  }
}
