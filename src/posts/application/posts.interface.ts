import { ObjectId } from 'mongodb';
import { PostItemDBType, PostItemType } from '../infrastructure/posts.type';
import { CreatePostDTO } from './dto/posts.dto';

export abstract class PostsStateRepository {
  abstract createPost(postItem: PostItemType): Promise<PostItemDBType>;
  abstract updatePost(id: ObjectId, postItem: CreatePostDTO): Promise<boolean>;
  abstract deletePost(id: ObjectId): Promise<boolean>;
}
