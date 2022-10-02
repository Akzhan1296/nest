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
import { BlogsService } from '../application/blogs.services';
import { BlogInputModelType } from '../infrastructure/blogs.type';

@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsService.name)
    protected blogsService: BlogsService,
  ) {}
  @Post()
  createBlog(@Body() blogInputModel: BlogInputModelType) {
    return this.blogsService.createBlog(blogInputModel);
  }
  @Put(':id')
  updateBlog(
    @Param() params: { id: ObjectId },
    @Body() blogInputModel: BlogInputModelType,
  ) {
    return this.blogsService.updateBlog(params.id, blogInputModel);
  }
  @Delete(':id')
  deleteBlog(@Param() params: { id: ObjectId }) {
    return this.blogsService.deleteBlog(params.id);
  }
}
