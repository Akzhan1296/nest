import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  Comment,
  CommentDocument,
} from 'src/features/comments/domain/entity/comments.schema';
import { CommentViewModel } from '../models/view.models';
import { Paginated } from '../../../../common/utils';
import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../../common/common-types';
import {
  BlogItemDBType,
  BlogItemType,
} from '../../../blogs/_infrastructure/blogs.type';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<CommentDocument>,
  ) {}

  private async getCommentsCount(postId: string | undefined): Promise<number> {
    const filter = postId ? { postId } : {};
    return this.CommentModel.find(filter).count();
  }
  private getCommentsViewModel(
    comments: CommentDocument[],
    isPostId = false,
  ): CommentViewModel[] {
    let viewModel = comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.getContent(),
      commentatorInfo: {
        userId: comment.userId.toString(),
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.getLikes(),
        dislikesCount: comment.getDislikes(),
      },
    }));

    if (isPostId) {
      viewModel = comments.map((comment) => ({
        id: comment._id.toString(),
        content: comment.getContent(),
        commentatorInfo: {
          userId: comment.userId.toString(),
          userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.getLikes(),
          dislikesCount: comment.getDislikes(),
        },
        postId: comment.postId,
      }));
    }

    return viewModel;
  }
  private async getPaginatedPosts(
    pageParams: PageSizeQueryModel,
    comments: CommentDocument[],
    isPostId = false,
    postId?: string,
  ): Promise<PaginationViewModel<CommentViewModel>> {
    return Paginated.transformPagination<CommentViewModel>(
      { ...pageParams, totalCount: await this.getCommentsCount(postId) },
      this.getCommentsViewModel(comments, isPostId),
    );
  }

  async getComments(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<CommentViewModel>> {
    const { pageSize } = pageParams;
    const comments = await this.CommentModel.find().skip(1).limit(pageSize);
    return this.getPaginatedPosts(pageParams, comments);
  }
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const objId = new ObjectId(id);

    const comment = await this.CommentModel.findById({ _id: objId });
    if (comment) {
      return {
        id: comment._id.toString(),
        content: comment.getContent(),
        commentatorInfo: {
          userId: comment.userId.toString(),
          userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.getLikes(),
          dislikesCount: comment.getDislikes(),
          myStatus: 'None',
        },
      };
    }
    return null;
  }
  async getCommentsByPostId(
    pageParams: PageSizeQueryModel,
    postId: string,
  ): Promise<PaginationViewModel<CommentViewModel>> {
    const { skip, pageSize, sortBy, sortDirection } = pageParams;

    const comments = await this.CommentModel.find({ postId })
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);
    return this.getPaginatedPosts(pageParams, comments, false, postId);
  }
  async getBlogAllComments(
    blogs: BlogItemDBType[],
    pageParams: PageSizeQueryModel,
  ) {
    // const comments = await this.repo.find({postId: posts.map(p=>p._id)}).sort().skip().limit()
    const { skip, pageSize, sortBy, sortDirection } = pageParams;
    const ids = blogs.map((b) => b._id);
    const comments = await this.CommentModel.find({
      blogId: { $in: ids }, // ['123', '456']
    })
      .skip(skip)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .limit(pageSize);

    return this.getPaginatedPosts(pageParams, comments, true);
  }
}
