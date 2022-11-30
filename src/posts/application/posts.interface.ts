import { PostItemDBType, PostItemType } from '../infrastructure/posts.type';
import { CreatePostDTO } from './dto/posts.dto';

export abstract class PostsStateRepository {
  abstract getPostById(id: string): Promise<PostItemDBType>;
  abstract createPost(postItem: PostItemType): Promise<PostItemDBType>;
  abstract updatePost(id: string, postItem: CreatePostDTO): Promise<boolean>;
  abstract deletePost(id: string): Promise<boolean>;
}
