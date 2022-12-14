import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
  ) {}

  private async getCommentsCount(postId: string | undefined): Promise<number> {
    const filter = postId ? { postId } : {};
    return this.CommentModel.find(filter).count();
  }
  private getCommentsViewModel(
    comments: CommentDocument[],
  ): CommentViewModel[] {
    return comments.map((comment) => ({
      id: comment._id.toString(),
      content: comment.getContent(),
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    }));
  }
  private async getPaginatedPosts(
    pageParams: PageSizeQueryModel,
    comments: CommentDocument[],
    postId?: string,
  ): Promise<PaginationViewModel<CommentViewModel>> {
    return Paginated.transformPagination<CommentViewModel>(
      { ...pageParams, totalCount: await this.getCommentsCount(postId) },
      this.getCommentsViewModel(comments),
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
    const comment = await this.CommentModel.findById({ _id: id });
    if (comment)
      ({
        id: comment._id.toString(),
        content: comment.getContent(),
        userId: comment.userId.toString(),
        userLogin: 'userLogin',
        createdAt: comment.createdAt,
      });
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
    return this.getPaginatedPosts(pageParams, comments, postId);
  }
  async dropComments() {
    return this.CommentModel.deleteMany({});
  }
}
