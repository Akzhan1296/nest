import { ObjectId } from 'mongoose';

export abstract class PostsStateRepository {
  abstract getPostByBlogId(blogId: ObjectId): Promise<string[]>;
  //   abstract createBlog(dto: BlogType): Promise<BlogItemDBType>;
  //   abstract updateBlog(id: ObjectId, dto: BlogType): Promise<boolean>;
  //   abstract deleteBlog(id: ObjectId): Promise<boolean>;
}
