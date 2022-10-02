import { BlogItemDBType, BlogType } from '../infrastructure/blogs.type';
import { ObjectId } from 'mongoose';
import { BlogsStateRepository } from './blogs.interface';
import { PostsStateRepository } from 'src/posts/application/posts.interface';
import { BlogsQueryStateRepository } from './blogs.query.interface';

export class BlogsService {
  constructor(
    protected blogRepository: BlogsStateRepository,
    protected blogQueryRepository: BlogsQueryStateRepository,
    protected postsRepository: PostsStateRepository,
  ) {}
  createBlog(dto: BlogType): Promise<BlogItemDBType> {
    return this.blogRepository.createBlog(dto);
  }
  async updateBlog(id: ObjectId, dto: BlogType): Promise<boolean> {
    let isBlogUpdated = false;
    const blog = await this.blogQueryRepository.getBlogById(id);
    if (blog) {
      isBlogUpdated = await this.blogRepository.updateBlog(id, dto);
    }
    return isBlogUpdated;
  }
  async deleteBlog(id: ObjectId): Promise<boolean> {
    let isBlogDeleted = false;
    const blog = await this.blogQueryRepository.getBlogById(id);
    if (blog) {
      isBlogDeleted = await this.blogRepository.deleteBlog(id);
    }
    return isBlogDeleted;
  }
}
