// import { BlogsStateRepository } from '../api/blogger/application/blogs.interface';
// import { BlogsService } from '../api/blogger/application/blogs.services';
// import { BlogsRepository } from '../api/blogger/infrastructure/repository/blogs.repository';

// export const factoryBlogsService = () => {
//   return {
//     provide: BlogsService.name,
//     useFactory: (blogStateRepository: BlogsStateRepository) => {
//       return new BlogsService(blogStateRepository);
//     },
//     inject: [BlogsRepository],
//   };
// };
