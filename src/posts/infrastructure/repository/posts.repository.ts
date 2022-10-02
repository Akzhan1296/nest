import { Injectable } from '@nestjs/common';
import { PostsStateRepository } from 'src/posts/application/posts.interface';
import { ObjectId } from 'mongoose';

@Injectable()
export class PostsRepository implements PostsStateRepository {
  async getPostByBlogId(blogId: ObjectId): Promise<string[]> {
    console.log(blogId);
    return ['ads'];
  }
}
