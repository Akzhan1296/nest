import { PostsQueryStateRepository } from 'src/posts/application/posts.query.interface';
import { PostsQueryRepository } from 'src/posts/infrastructure/repository/posts.query.repository';
import { BlogsStateRepository } from '../application/blogs.interface';
import { BlogsQueryStateRepository } from '../application/blogs.query.interface';
import { BlogsService } from '../application/blogs.services';
import { BlogsQueryRepository } from '../infrastructure/repository/blogs.query.repository';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';

export const factoryBlogsService = () => {
  return {
    provide: BlogsService.name,
    useFactory: (
      blogStateRepository: BlogsStateRepository,
      blogsQueryStateRepository: BlogsQueryStateRepository,
      postsQueryStateRepository: PostsQueryStateRepository,
    ) => {
      return new BlogsService(
        blogStateRepository,
        blogsQueryStateRepository,
        postsQueryStateRepository,
      );
    },
    inject: [BlogsRepository, BlogsQueryRepository, PostsQueryRepository],
  };
};
