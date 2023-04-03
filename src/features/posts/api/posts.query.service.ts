import { PostsQueryRepository } from '../infrastructure/repository/posts.query.repository';

export class PostsQueryService {
  constructor(protected postQuerysRepository: PostsQueryRepository) {}
  getPostById(id: string) {
    return this.postQuerysRepository.getPostById(id);
  }
}
