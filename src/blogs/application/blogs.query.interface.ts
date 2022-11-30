import {
  PageSizeQueryModel,
  PaginationViewModel,
} from 'src/common/common-types';
import { BlogViewModel } from '../infrastructure/repository/models/view.models';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: string): Promise<BlogViewModel | null>;
  abstract getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>>;
}
