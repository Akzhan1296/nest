import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PostsService } from '../application/posts.service';
import { PostInputModel } from '../infrastructure/posts.type';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService.name)
    protected postService: PostsService,
  ) {}
  @Post()
  createPost(@Body() postsInputModel: PostInputModel) {
    return this.postService.createPost(postsInputModel);
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
