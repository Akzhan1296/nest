import { PostItemType } from '../infrastructure/posts.type';
import { PostDocument } from '../schema/posts.schema';
import { CreatePostDTO } from './dto/posts.dto';

export abstract class PostsStateRepository {
  abstract getPostById(id: string): Promise<PostDocument>;
  abstract createPost(postItem: PostItemType): Promise<PostDocument>;
  abstract updatePost(id: string, postItem: CreatePostDTO): Promise<boolean>;
  abstract deletePost(id: string): Promise<boolean>;
}
