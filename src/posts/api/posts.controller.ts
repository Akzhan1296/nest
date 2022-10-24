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
import { PostsService } from '../application/posts.service';
import { PostInputModel, PostViewModel } from '../infrastructure/posts.type';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService.name)
    protected postService: PostsService,
    protected postQuerysRepository: PostsQueryRepository,
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
}
