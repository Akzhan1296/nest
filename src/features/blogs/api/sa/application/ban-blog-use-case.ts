import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanBlogDTO, BanBlogResultDTO } from './dto/sa.dto';
import { BlogsRepository } from '../../../_infrastructure/repository/blogs.repository';

export class BanBlogBySACommand {
  constructor(public banBlogDTO: BanBlogDTO) {}
}
@CommandHandler(BanBlogBySACommand)
export class BanBlogBySAUseCase implements ICommandHandler<BanBlogBySACommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: BanBlogBySACommand): Promise<BanBlogResultDTO> {
    const { blogId, isBanned } = command.banBlogDTO;
    const result = {
      isBlogBanned: false,
      isBlogFound: false,
    };
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) return result;

    result.isBlogFound = true;
    result.isBlogBanned = await this.blogsRepository.banBlog(blogId, isBanned);

    return result;
  }
}
