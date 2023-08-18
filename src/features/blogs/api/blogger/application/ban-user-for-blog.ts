import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserBlogDTO, BanUserBlogResultDTO } from './ban-user.dto';
import { UsersRepository } from '../../../../users/infrastructure/repository/users.repository';
import { ForbiddenException } from '@nestjs/common';
import { BanBlogsRepository } from '../../../_infrastructure/repository/blogs-ban.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BanBlog, BanBlogsDocument } from '../../../domain/ban-blogs.schema';
import { BlogsRepository } from '../../../_infrastructure/repository/blogs.repository';

export class BanUserForBlogCommand {
  constructor(public banUserForBlogDTO: BanUserBlogDTO) {}
}
@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    @InjectModel(BanBlog.name)
    private readonly BanBlogModel: Model<BanBlogsDocument>,
    private readonly usersRepository: UsersRepository,
    private readonly banBlogsRepository: BanBlogsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: BanUserForBlogCommand): Promise<BanUserBlogResultDTO> {
    const result = {
      isUserFound: false,
      isUserBanned: false,
      isFoubidden: true,
    };

    const blogBanEntity = await this.banBlogsRepository.findBanBlogByIds(
      command.banUserForBlogDTO.blogId,
      command.banUserForBlogDTO.userId,
    );

    const user = await this.usersRepository.findUserById(
      command.banUserForBlogDTO.userId,
    );
    if (user) result.isUserFound = true;

    const blog = await this.blogsRepository.getBlogById(
      command.banUserForBlogDTO.blogId,
    );

    if (
      blog.ownerId.toString() === command.banUserForBlogDTO.ownerId.toString()
    ) {
      result.isFoubidden = false;
    }

    //ban
    if (user && command.banUserForBlogDTO.isBanned && !blogBanEntity) {
      const banBlogUsers = new this.BanBlogModel();
      banBlogUsers.setUser(
        {
          banReason: command.banUserForBlogDTO.banReason,
          isBanned: command.banUserForBlogDTO.isBanned,
          userId: command.banUserForBlogDTO.userId,
          userLogin: user.getLogin(),
          banDate: new Date(),
        },
        command.banUserForBlogDTO.blogId,
      );

      result.isUserBanned = await this.banBlogsRepository.save(banBlogUsers);
    }

    // unban
    if (user && !command.banUserForBlogDTO.isBanned && blogBanEntity) {
      await this.banBlogsRepository.delete(blogBanEntity);
    }

    console.log(result);

    return result;
  }
}
