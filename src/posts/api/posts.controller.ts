import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CommentsService } from 'src/comments/application/comments.service';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { CommentViewModel } from 'src/comments/infrastructure/repository/models/view.models';
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
  async createPost(
    @Body() postsInputModel: PostInputModel,
  ): Promise<PostViewModel> {
    const post = await this.postService.createPost(postsInputModel);
    const viewModel = this.postQuerysRepository.getPostById(post._id);
    return viewModel;
  }
  @Put(':id')
  updatePost(
    @Param() params: { id: ObjectId },
    @Body() postsInputModel: PostInputModel,
  ) {
    return this.postService.updatePost(params.id, postsInputModel);
  }
  @Delete(':id')
  deletePost(@Param() params: { id: ObjectId }) {
    return this.postService.deletePost(params.id);
  }
  @Post(':postId/comments')
  async createCommentForSelectedpost(
    @Param() params: { postId: ObjectId },
    @Body() commentInputModel: CreateCommentInputModel,
  ): Promise<CommentViewModel> {
    const userId = 'userId'; // from JWT

    const comment = await this.commentsService.createCommentForSelectedPost({
      postId: params.postId,
      userId,
      content: commentInputModel.content,
    });
    return await this.commentsQueryRepository.getCommentById(comment._id);
  }
}
