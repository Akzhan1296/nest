import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PostItemType, PostType } from '../infrastructure/posts.type';
import { PostsStateRepository } from './posts.interface';
import { PostsQueryStateRepository } from './posts.query.interface';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsStateRepository,
    protected postQuerysRepository: PostsQueryStateRepository,
  ) {}
  async createPost(dto: PostType) {
    const newPost = new PostItemType(
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      'name',
      new Date(),
    );
    this.postsRepository.createPost(newPost);
  }
  async updatePost(id: ObjectId, dto: PostType) {
    this.postsRepository.updatePost(id, dto);
  }
  async deletePost(id: ObjectId) {
    this.postsRepository.deletePost(id);
  }
}
