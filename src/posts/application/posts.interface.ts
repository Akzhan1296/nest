import { ObjectId } from 'mongodb';
import {
  PostItemDBType,
  PostItemType,
  PostType,
} from '../infrastructure/posts.type';

export abstract class PostsStateRepository {
  abstract createPost(postItem: PostItemType): Promise<PostItemDBType>;
  abstract updatePost(id: ObjectId, postItem: PostType): Promise<boolean>;
  abstract deletePost(id: ObjectId): Promise<boolean>;
}
