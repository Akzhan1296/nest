import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ObjectId } from 'mongoose';

@Controller('posts')
export class PostsController {
  // @Post()
  // createPost(@Body() bloggerInputModel: BloggerInputModel) {
  //   return this.bloggersService.createBlogger(bloggerInputModel);
  // }
  // @Put(':id')
  // updatePost(
  //   @Param() params: { id: ObjectId },
  //   @Body() bloggerInputModel: BloggerInputModel,
  // ) {
  //   return this.bloggersService.updateBlogger(params.id, bloggerInputModel);
  // }
  // @Delete(':id')
  // deletePost(@Param() params: { id: ObjectId }) {
  //   return this.bloggersService.deleteBlogger(params.id);
  // }
}
