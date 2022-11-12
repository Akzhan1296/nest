// schema
import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  id: ObjectId;
  @Prop()
  userId: ObjectId;
  @Prop()
  userLogin: string;
  @Prop()
  private content: string;
  @Prop()
  createdAt: Date;
  @Prop()
  postId: ObjectId;

  setContent(content: string) {
    // run antimat checking - domain business logic/  check rules/invariants
    // if bad then trow new Error();
    if (content.length < 20 || content.length > 100) {
      throw new Error();
    }
    this.content = content;
  }
  getContent() {
    // run antimat checking - domain business logic/  check rules/invariants
    // if bad then trow new Error();
    return this.content;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods.setContent = Comment.prototype.setContent;
CommentSchema.methods.getContent = Comment.prototype.getContent;
