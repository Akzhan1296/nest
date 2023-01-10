import { BlogsStateRepository } from '../application/blogs.interface';
import { BlogsService } from '../application/blogs.services';
import { BlogsRepository } from '../infrastructure/repository/blogs.repository';

export const factoryBlogsService = () => {
  return {
    provide: BlogsService.name,
    useFactory: (blogStateRepository: BlogsStateRepository) => {
      return new BlogsService(blogStateRepository);
    },
    inject: [BlogsRepository],
  };
};
