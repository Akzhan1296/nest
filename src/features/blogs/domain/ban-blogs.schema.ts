import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BannedUserBlogType } from '../_infrastructure/blogs.type';

export type BanBlogsDocument = HydratedDocument<BanBlog>;
@Schema({ timestamps: true })
export class BanBlog {
  @Prop()
  blogId: string;
  @Prop()
  banReason: null | string;
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  banDate: Date;
  @Prop()
  isBanned: boolean;

  setUser(userData: BannedUserBlogType, blogId: string) {
    this.blogId = blogId;
    this.banReason = userData.banReason;
    this.isBanned = userData.isBanned;
    this.banDate = userData.banDate;
    this.userId = userData.userId;
    this.userLogin = userData.userLogin;
  }
}

export const BanBlogSchema = SchemaFactory.createForClass(BanBlog);
BanBlogSchema.methods.setUser = BanBlog.prototype.setUser;
