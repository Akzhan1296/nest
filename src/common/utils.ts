import { PageSizeQueryModel, PaginationViewModel } from './common-types';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

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
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export abstract class Utils {
  static async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
  static async transformObjectId(id: string): Promise<ObjectId> {
    try {
      return new ObjectId(id);
    } catch (err) {
      throw new Error(err);
    }
  }
}
