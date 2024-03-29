import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../../common/common-types';
import { BlogViewModel } from '../_models/view.models';

export abstract class BlogsQueryStateRepository {
  abstract getBlogById(id: string): Promise<BlogViewModel | null>;
  abstract getBlogs(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<BlogViewModel>>;
}
