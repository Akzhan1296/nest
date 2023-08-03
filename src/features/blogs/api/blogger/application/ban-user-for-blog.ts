import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../_infrastructure/repository/blogs.repository';
import { BanUserBlogDTO, BanUserBlogResultDTO } from './ban-user.dto';
import { UsersRepository } from '../../../../users/infrastructure/repository/users.repository';

export class BanUserForBlogCommand {
  constructor(public banUserForBlogDTO: BanUserBlogDTO) {}
}
@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: BanUserForBlogCommand): Promise<BanUserBlogResultDTO> {
    const result = {
      isUserFound: false,
      isUserBanned: false,
      isBlogFound: false,
    };
    const blog = await this.blogsRepository.getBlogById(
      command.banUserForBlogDTO.blogId,
    );
    if (blog) result.isBlogFound = true;

    const user = await this.usersRepository.findUserById(
      command.banUserForBlogDTO.userId,
    );

    if (user) result.isUserFound = true;

    if (user && command.banUserForBlogDTO.isBanned) {
      blog.bannedUsers = [
        ...blog.bannedUsers,
        {
          banReason: command.banUserForBlogDTO.banReason,
          isBanned: command.banUserForBlogDTO.isBanned,
          userId: command.banUserForBlogDTO.userId,
          userLogin: user.getLogin(),
          banDate: new Date(),
        },
      ];
      result.isUserBanned = await blog
        .save()
        .then((savedDoc) => {
          return savedDoc === blog;
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    }

    if (user && !command.banUserForBlogDTO.isBanned) {
      blog.bannedUsers = blog.bannedUsers.filter(
        (user) => user.userId !== command.banUserForBlogDTO.userId,
      );
      result.isUserBanned = await blog
        .save()
        .then((savedDoc) => {
          return savedDoc === blog;
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    }

    // result.isBlogFound = true;
    // result.isBlogBanned = await this.blogsRepository.banBlog(blogId, isBanned);

    return result;
  }
}
