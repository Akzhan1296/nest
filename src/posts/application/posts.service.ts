import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogsStateRepository } from 'src/blogs/application/blogs.interface';
import { PostItemType } from '../infrastructure/posts.type';
import { CreatePostDTO } from './dto/posts.dto';
import { PostsStateRepository } from './posts.interface';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsStateRepository,
    protected blogsRepository: BlogsStateRepository,
  ) {}
  async createPost(dto: CreatePostDTO) {
    const blog = await this.blogsRepository.getBlogById(dto.blogId);
    

    const newPost = new PostItemType(
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      blog.name,
      new Date(),
    );
    const post = this.postsRepository.createPost(newPost);

    return post;
  }
  async updatePost(id: ObjectId, dto: CreatePostDTO) {
    this.postsRepository.updatePost(id, dto);
  }
  async deletePost(id: ObjectId) {
    this.postsRepository.deletePost(id);
  }
}
