import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostInputModel {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(30)
  title: string;
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string;
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
