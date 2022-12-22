import { PageSizeQueryModel, PaginationViewModel } from './common-types';
import * as bcrypt from 'bcrypt';

export abstract class Paginated {
  static transformPagination<T>(
    pageParams: PageSizeQueryModel & { totalCount: number },
    items: T[],
  ): PaginationViewModel<T> {
    return {
      totalCount: pageParams.totalCount,
      page: pageParams.pageNumber,
      pageSize: pageParams.pageSize,
      pagesCount: Math.ceil(pageParams.totalCount / pageParams.pageSize),
      items: items,
    };
  }
}

export const generateHash = async (password: string) => {
  console.log(password);
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
