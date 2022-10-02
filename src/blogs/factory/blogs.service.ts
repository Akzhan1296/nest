import { PostsStateRepository } from 'src/posts/application/posts.interface';
import { PostsRepository } from 'src/posts/infrastructure/repository/posts.repository';
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
      postsStateRepository: PostsStateRepository,
    ) => {
      return new BlogsService(
        blogStateRepository,
        blogsQueryStateRepository,
        postsStateRepository,
      );
    },
    inject: [BlogsRepository, BlogsQueryRepository, PostsRepository],
  };
};
