import { PostsStateRepository } from '../application/posts.interface';
import { PostsQueryStateRepository } from '../application/posts.query.interface';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';
import { PostsRepository } from '../infrastructure/repository/posts.repository';

export const factoryPostService = () => {
  return {
    provide: PostsService.name,
    useFactory: (
      postsStateRepository: PostsStateRepository,
      postsQueryStateRepository: PostsQueryStateRepository,
    ) => {
      return new PostsService(postsStateRepository, postsQueryStateRepository);
    },
    inject: [PostsRepository, PostsQueryRepository],
  };
};
