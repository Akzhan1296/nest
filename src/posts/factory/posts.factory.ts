import { BlogsStateRepository } from '../../blogs/application/blogs.interface';
import { BlogsRepository } from '../../blogs/infrastructure/repository/blogs.repository';
import { PostsStateRepository } from '../application/posts.interface';
import { PostsService } from '../application/posts.service';
import { PostsRepository } from '../infrastructure/repository/posts.repository';

export const factoryPostService = () => {
  return {
    provide: PostsService.name,
    useFactory: (
      postsStateRepository: PostsStateRepository,
      blogsStateRepository: BlogsStateRepository,
    ) => {
      return new PostsService(postsStateRepository, blogsStateRepository);
    },
    inject: [PostsRepository, BlogsRepository],
  };
};
