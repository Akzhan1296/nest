export class PageSizeQueryModel {
  pageNumber: number;
  pageSize: number;
  skip: number;
  searchNameTerm?: { name: string };
}

export type PaginationViewModel<T> = {
  page: number;
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  items: Array<T>;
};
