import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;
@Schema({ timestamps: true })
export class Like {
  @Prop()
  private likeStatus: string;
  @Prop()
  private commentId: ObjectId;
  @Prop()
  private postId: ObjectId;
  @Prop()
  private userId: ObjectId;
  @Prop({ default: false })
  private isBanned: boolean;

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

  setCommentId(commentId: ObjectId) {
    this.commentId = commentId;
  }
  getCommentId() {
    return this.commentId;
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
  getUserBanStatus() {
    return this.isBanned;
  }
  setUserBanStatus(isBanned: boolean) {
    this.isBanned = isBanned;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.methods.setLikeStatus = Like.prototype.setLikeStatus;
LikeSchema.methods.getLikeStatus = Like.prototype.getLikeStatus;
LikeSchema.methods.setCommentId = Like.prototype.setCommentId;
LikeSchema.methods.getCommentId = Like.prototype.getCommentId;
LikeSchema.methods.setUserId = Like.prototype.setUserId;
LikeSchema.methods.getUserId = Like.prototype.getUserId;
LikeSchema.methods.setPostId = Like.prototype.setPostId;
LikeSchema.methods.setUserBanStatus = Like.prototype.setUserBanStatus;
LikeSchema.methods.getUserBanStatus = Like.prototype.getUserBanStatus;
