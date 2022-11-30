import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!blog) {
      throw new NotFoundException('blog not found');
    }
    const newPost = new PostItemType(
      dto.title,
      dto.shortDescription,
      dto.content,
      new ObjectId(dto.blogId),
      blog.name,
      new Date(),
    );
    return this.postsRepository.createPost(newPost);
  }
  async updatePost(id: string, dto: CreatePostDTO) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    this.postsRepository.updatePost(id, dto);
  }
  async deletePost(id: string) {
    const post = await this.postsRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    this.postsRepository.deletePost(id);
  }
}
