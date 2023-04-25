import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repository/blogs.query.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidBlog implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  public async validate(blogId: string): Promise<boolean> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    return !!blog;
  }
}

export function IsBlogExist(validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {};
  }
  if (!validationOptions.message) {
    validationOptions.message = 'not exist';
  }
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBlogExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBlog,
    });
  };
}
