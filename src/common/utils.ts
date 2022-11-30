import { PageSizeQueryModel, PaginationViewModel } from './common-types';

export class Paginated<T> {
  private totalCount = 0;
  constructor(
    public pageParams: PageSizeQueryModel & { totalCount: number },
    public items: T[],
  ) {}
  transformPagination(): PaginationViewModel<T> {
    return {
      totalCount: this.pageParams.totalCount,
      page: this.pageParams.pageNumber,
      pageSize: this.pageParams.pageSize,
      pagesCount: Math.ceil(
        this.pageParams.totalCount / this.pageParams.pageSize,
      ),
      items: this.items,
    };
  }
}
