import { IsBoolean } from 'class-validator';

export class BanBlogInputModal {
  @IsBoolean()
  isBanned: boolean;
}
