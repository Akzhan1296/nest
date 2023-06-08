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
  @Prop()
  userId: ObjectId;
  @Prop({ default: 0 })
  likeCount: number;
  @Prop({ default: 0 })
  dislikeCount: number;
  @Prop()
  private newestLikes: NewestUser[];
  @Prop()
  private whoLiked: NewestUser[];
  @Prop()
  private likedUsers: string[];
  getLikedUsers() {
    return this.likedUsers;
  }
  setUserId(userId: ObjectId) {
    this.userId = userId;
  }
  setLikedUsers(id: string) {
    this.likedUsers = [...this.likedUsers, id];
  }
  getNewestLikes() {
    return this.newestLikes.reverse();
  }
  setNewestUser(user: NewestUser) {
    const users = [...this.newestLikes];
    if (users.length >= 3) {
      users.shift();
      users.push(user);
    }
    if (users.length < 3) {
      users.push(user);
    }
    this.newestLikes = users;
  }
  getWhoLiked() {
    return this.whoLiked;
  }
  setWhoLiked(user: NewestUser) {
    this.whoLiked.push(user);
  }
  removeNewestUser(userId: string) {
    const filteredLikes = this.newestLikes.filter(
      (like) => like.userId !== userId,
    );
    this.newestLikes = filteredLikes;
  }
}

export const PostsSchema = SchemaFactory.createForClass(Post);
PostsSchema.methods.setNewestUser = Post.prototype.setNewestUser;
PostsSchema.methods.setLikedUsers = Post.prototype.setLikedUsers;
PostsSchema.methods.getNewestLikes = Post.prototype.getNewestLikes;
PostsSchema.methods.getLikedUsers = Post.prototype.getLikedUsers;
PostsSchema.methods.removeNewestUser = Post.prototype.removeNewestUser;
PostsSchema.methods.setUserId = Post.prototype.setUserId;
PostsSchema.methods.setWhoLiked = Post.prototype.setWhoLiked;
PostsSchema.methods.getWhoLiked = Post.prototype.getWhoLiked;
