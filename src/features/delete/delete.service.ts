import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogItemType } from '../blogs/_infrastructure/blogs.type';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schema/posts.schema';
import {
  Comment,
  CommentDocument,
} from '../comments/domain/entity/comments.schema';
import { Users, UsersDocument } from '../users/domain/entity/users.schema';
import { JwtTokens, JwtTokensDocument } from '../jwt/domain/jwt.schema';
import { BlockIps, BlockIpsDocument } from '../ips/domain/ips.schema';
import { Like, LikeDocument } from '../likes/domain/likes.schema';
import { PostLike, PostLikeDocument } from '../likes/domain/posts.likes.schema';
import { BanBlog, BanBlogsDocument } from '../blogs/domain/ban-blogs.schema';

@Injectable()
export class DeleteService {
  constructor(
    @InjectModel(BlogItemType.name)
    private readonly blogModel: Model<BlogItemType>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
    @InjectModel(Users.name)
    private readonly UserModel: Model<UsersDocument>,
    @InjectModel(JwtTokens.name)
    private readonly JwtTokenModel: Model<JwtTokensDocument>,
    @InjectModel(BlockIps.name)
    private readonly BlockIpsModel: Model<BlockIpsDocument>,
    @InjectModel(Like.name)
    private readonly LikeModel: Model<LikeDocument>,
    @InjectModel(PostLike.name)
    private readonly PostLikeModel: Model<PostLikeDocument>,
    @InjectModel(BanBlog.name)
    private readonly BanBlogModel: Model<BanBlogsDocument>,
  ) {}
  async deleteData() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.CommentModel.deleteMany({});
    await this.UserModel.deleteMany({});
    await this.JwtTokenModel.deleteMany({});
    await this.BlockIpsModel.deleteMany({});
    await this.LikeModel.deleteMany({});
    await this.PostLikeModel.deleteMany({});
    await this.BanBlogModel.deleteMany({});
  }
}
