import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema({ timestamps: true })
export class PostLike {
  @Prop()
  private likeStatus: string;
  @Prop()
  private postId: ObjectId;
  @Prop()
  private userId: ObjectId;

  setLikeStatus(likeStatus: string) {
    if (
      likeStatus === 'Like' ||
      likeStatus === 'Dislike' ||
      likeStatus === 'None'
    ) {
      if (this.likeStatus === likeStatus) {
        return;
      }
      this.likeStatus = likeStatus;
      return;
    }
    throw new Error('wrong like status');
  }
  getLikeStatus() {
    return this.likeStatus;
  }
  setPostId(postId: ObjectId) {
    this.postId = postId;
  }
  getPostId() {
    return this.postId;
  }
  setUserId(userId: ObjectId) {
    this.userId = userId;
  }
  getUserId() {
    return this.userId;
  }
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
PostLikeSchema.methods.setLikeStatus = PostLike.prototype.setLikeStatus;
PostLikeSchema.methods.getLikeStatus = PostLike.prototype.getLikeStatus;
PostLikeSchema.methods.setUserId = PostLike.prototype.setUserId;
PostLikeSchema.methods.getUserId = PostLike.prototype.getUserId;
PostLikeSchema.methods.setPostId = PostLike.prototype.setPostId;
PostLikeSchema.methods.getPostId = PostLike.prototype.getPostId;

