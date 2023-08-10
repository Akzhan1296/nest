import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from './blogs.query.repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/repository/posts.query.repository';
import { CommentsQueryRepository } from '../../../comments/infrastructure/repository/comments.query.repository';
import { PostDocument } from '../../../posts/schema/posts.schema';
import { PageSizeQueryModel } from '../../../../common/common-types';
import { CommentDocument } from '../../../comments/domain/entity/comments.schema';
import { BlogItemDBType } from '../blogs.type';

@Injectable()
export class BlogsQueryServiceRepository {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getCommentAll(pageSize: PageSizeQueryModel, userId: string) {
    const blogs: Array<BlogItemDBType> =
      await this.blogsQueryRepository.getBlogsAllComments(userId); // [ {userId, blogId1}, {userid, blogId2} ]

    const postsPromises = blogs.map((blog) => {
      return this.postsQueryRepository.getPostsAllComments(blog._id);
    });
    const posts = await Promise.all(postsPromises); // [ [{}], [{}, {}], [{}]]
    const postsa: Array<PostDocument> = [].concat(...posts); // [{}, {}, {}, {}]
    // const comments = await this.repo.find({postId: posts.map(p=>p._id)}).sort().skip().limit()
    // const commentPromises = postsa.map((post) => {
    //   return this.commentsQueryRepository.getBlogAllComments(
    //     post._id.toString(),
    //   );
    // });
    // const comments = await Promise.all(commentPromises);
    // const commentsView = [].concat(...comments);

    const comments = await this.commentsQueryRepository.getBlogAllComments(
      blogs,
      pageSize,
    );

    // const paginator = (
    //   array: Array<CommentDocument>,
    //   pageSize: number,
    //   pageNumber: number,
    // ) => {
    //   return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    // };

    // const paginatedComments = paginator(
    //   comments,
    //   pageSize.pageSize,
    //   pageSize.pageNumber,
    // ).sort(function (a, b) {
    //   return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    // });

    return {
      ...comments,
      items: comments.items.map((comment) => {
        const { postId, ...rest } = comment;
        const post = postsa.filter(
          (p) => p._id.toString() === postId.toString(),
        )[0];
        return {
          ...rest,
          likesInfo: {
            ...comment.likesInfo,
            myStatus: 'None',
          },
          postInfo: {
            id: post._id,
            title: post.title,
            blogId: post.blogId,
            blogName: post.blogName,
          },
        };
      }),
    };
  }
}
