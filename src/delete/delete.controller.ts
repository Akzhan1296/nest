import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsQueryRepository } from 'src/blogs/infrastructure/repository/blogs.query.repository';
import { CommentsQueryRepository } from 'src/comments/infrastructure/repository/comments.query.repository';
import { PostsQueryRepository } from 'src/posts/infrastructure/repository/posts.query.repository';

@Controller('testing/all-data')
export class DeleteController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteBlog(): Promise<undefined> {
    await this.blogsQueryRepository.dropBlogs();
    await this.postsQueryRepository.dropPosts();
    await this.commentsQueryRepository.dropComments();
    return;
  }
}
