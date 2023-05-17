import { PostsStateRepository } from '../../posts/application/posts.interface';
import { PostsRepository } from '../../posts/infrastructure/repository/posts.repository';
import { BlogsStateRepository } from '../api/blogger/application/blogs.interface';
import { BlogsService } from '../api/blogger/application/blogs.services';
import { BlogsRepository } from '../api/blogger/infrastructure/repository/blogs.repository';

export const factoryBlogsService = () => {
  return {
    provide: BlogsService.name,
    useFactory: (
      blogStateRepository: BlogsStateRepository,
      postStateRepository: PostsStateRepository,
    ) => {
      return new BlogsService(blogStateRepository, postStateRepository);
    },
    inject: [BlogsRepository, PostsRepository],
  };
};
