import { PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class QueryParamsPipe implements PipeTransform {
  public transform(value: any) {
    const pageSize = +value.pageSize || 10;
    const pageNumber = +value.pageNumber || 1;
    const skip = pageSize * (pageNumber - 1);
    // const searchNameTerm = value.searchNameTerm || '';
    // const searchLoginTerm = value.searchLoginTerm || '';
    // const searchEmailTerm = value.searchEmailTerm || '';

    return {
      pageSize,
      pageNumber,
      skip,
      // searchNameTerm,
      // searchLoginTerm,
      // searchEmailTerm,
    };
  }
}
