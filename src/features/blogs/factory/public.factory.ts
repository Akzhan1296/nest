import { PostsStateRepository } from '../../posts/application/posts.interface';
import { PostsRepository } from '../../posts/infrastructure/repository/posts.repository';
import { BlogsStateRepository } from '../_application/blogs.interface';
import { BlogsRepository } from '../_infrastructure/repository/blogs.repository';
import { BlogsService } from '../api/blogger/application/blogs.services';

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
