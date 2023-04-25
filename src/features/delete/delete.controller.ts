import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/repository/blogs.query.repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/repository/comments.query.repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/repository/posts.query.repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/repository/users.query.repository';
import { BlockIpsQueryRepository } from '../ips/infrastructure/ips.query.repository';
import { JwtTokensQueryRepository } from '../jwt/infrastructura/repository/jwt.query.repository';
import { LikesQueryRepository } from '../likes/infrastructure/repository/likes.query.repository';
import { PostLikesRepository } from '../likes/infrastructure/repository/post.likes.repository';

@Controller('testing/all-data')
export class DeleteController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtTokensQueryRepository: JwtTokensQueryRepository,
    private readonly blockIpsQueryRepository: BlockIpsQueryRepository,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly postLikesRepository: PostLikesRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteBlog(): Promise<undefined> {
    await this.blogsQueryRepository.dropBlogs();
    await this.postsQueryRepository.dropPosts();
    await this.commentsQueryRepository.dropComments();
    await this.usersQueryRepository.dropUsers();
    await this.jwtTokensQueryRepository.dropJwts();
    await this.blockIpsQueryRepository.dropIps();
    await this.likesQueryRepository.dropLikes();
    await this.postLikesRepository.dropPostLikes();
    return;
  }
}
