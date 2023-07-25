import { NotFoundException } from '@nestjs/common';
import {
  BlogOwnerDTO,
  BlogType,
  BlogUpdateType,
  UpdateOrDeletePostCheckResultDTO,
  UpdateOrDeletePostDTO,
} from '../../../_application/dto/blogs.dto';
import { ObjectId } from 'mongodb';
import {
  BlogItemDBType,
  BlogItemType,
} from '../../../_infrastructure/blogs.type';
import { PostsStateRepository } from '../../../../posts/application/posts.interface';
import { BlogsStateRepository } from '../../../_application/blogs.interface';
export class BlogsService {
  constructor(
    private readonly blogRepository: BlogsStateRepository,
    private readonly postsRepository: PostsStateRepository,
  ) {}

  private async checkIsBlogOwner(dto: BlogOwnerDTO): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(dto.blogId);
    if (blog) {
      return blog.ownerId.toString() === dto.userId.toString();
    }
    return false;
  }

  createBlog(dto: BlogType): Promise<BlogItemDBType> {
    const newBlog = new BlogItemType(
      dto.name,
      dto.websiteUrl,
      new Date(),
      dto.description,
      new ObjectId(dto.userId),
      dto.userLogin,
      false,
    );
    console.log(newBlog);
    return this.blogRepository.createBlog(newBlog);
  }
  async updateBlog(id: string, dto: BlogUpdateType): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      return await this.blogRepository.updateBlog(id, dto);
    } else {
      throw new NotFoundException('blog not found');
    }
  }
  async deleteBlog(id: string): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(id);
    if (blog) {
      return await this.blogRepository.deleteBlog(id);
    } else {
      throw new NotFoundException('blog not found');
    }
  }

  async checkBlockBeforeUpdateOrDelete(
    dto: UpdateOrDeletePostDTO,
  ): Promise<UpdateOrDeletePostCheckResultDTO> {
    const result = {
      isBlogFound: false,
      isPostFound: false,
      isForbidden: false,
    };

    const blog = await this.blogRepository.getBlogById(dto.blogId);
    if (blog) {
      result.isBlogFound = true;
    }
    let post = null;
    if (dto.postId) {
      post = await this.postsRepository.getPostById(dto.postId);
    }
    if (post) {
      result.isPostFound = true;
    }
    const isBlogOwner = await this.checkIsBlogOwner({
      blogId: dto.blogId,
      userId: dto.userId,
    });
    if (!isBlogOwner) {
      result.isForbidden = true;
    }
    return result;
  }
}
