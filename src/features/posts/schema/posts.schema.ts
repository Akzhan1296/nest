import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NewestUser } from '../infrastructure/posts.type';

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: ObjectId;
  @Prop()
  blogName: string;
  @Prop()
  createdAt: Date;
  @Prop({ default: 0 })
  likeCount: number;
  @Prop({ default: 0 })
  dislikeCount: number;
  @Prop()
  private newestLikes: NewestUser[];
  @Prop()
  private likedUsers: string[];
  getLikedUsers() {
    return this.likedUsers;
  }
  setLikedUsers(id: string) {
    this.likedUsers = [...this.likedUsers, id];
  }
  getNewestLikes() {
    return this.newestLikes;
  }
  setNewestUser(user: NewestUser) {
    const users = [...this.newestLikes];
    if (users.length >= 3) {
      users.pop();
      users.unshift(user);
    }
    if (users.length < 3) {
      users.push(user);
    }
    this.newestLikes = users;
  }
}

export const PostsSchema = SchemaFactory.createForClass(Post);
PostsSchema.methods.setNewestUser = Post.prototype.setNewestUser;
PostsSchema.methods.setLikedUsers = Post.prototype.setLikedUsers;
PostsSchema.methods.getNewestLikes = Post.prototype.getNewestLikes;
PostsSchema.methods.getLikedUsers = Post.prototype.getLikedUsers;
