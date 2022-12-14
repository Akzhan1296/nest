import {
  PageSizeQueryModel,
  PaginationViewModel,
} from '../../common/common-types';
import { PostViewModel } from '../infrastructure/repository/models/view.models';

export abstract class PostsQueryStateRepository {
  abstract getPostsByBlogId(
    pageParams: PageSizeQueryModel,
    blogId: string,
  ): Promise<PaginationViewModel<PostViewModel>>;
  abstract getPosts(
    pageParams: PageSizeQueryModel,
  ): Promise<PaginationViewModel<PostViewModel>>;
  abstract getPostById(id: string): Promise<PostViewModel | null>;
}
