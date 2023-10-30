import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: true })
export class Comment {
  @Prop()
  userId: ObjectId;
  @Prop()
  blogId: ObjectId;
  @Prop()
  userLogin: string;
  @Prop()
  private content: string;
  @Prop()
  createdAt: Date;
  @Prop()
  postId: ObjectId;
  @Prop({ default: 0 })
  likeCount: number;
  @Prop({ default: 0 })
  dislikeCount: number;

  setContent(content: string) {
    // run antimat checking - domain business logic/  check rules/invariants
    // if bad then trow new Error();
    if (content.length < 20 || content.length > 300) {
      throw new Error('error length');
    }
    this.content = content;
  }
  getContent() {
    return this.content;
  }
  getLikes() {
    return this.likeCount;
  }
  getDislikes() {
    return this.dislikeCount;
  }
  getPostId() {
    return this.postId;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods.setContent = Comment.prototype.setContent;
CommentSchema.methods.getContent = Comment.prototype.getContent;
CommentSchema.methods.getLikes = Comment.prototype.getLikes;
CommentSchema.methods.getDislikes = Comment.prototype.getDislikes;
CommentSchema.methods.getPostId = Comment.prototype.getPostId;
