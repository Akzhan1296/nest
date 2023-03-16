// // 404

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { LikesService } from '../../likes/application/likes.service';
// import { CommentsRepository } from '../infrastructure/repository/comments.repository';
// import { HandleLikeCommentDTO } from './dto/comments.dto';

// // from service => update like status

// @Injectable()
// export class CommentsService {
//   constructor(
//     protected commentsRepository: CommentsRepository,
//     protected likesService: LikesService,
//   ) {}

//   async handleCommentLikeStatus(likeCommentDto: HandleLikeCommentDTO) {
//     return this.likesService.handleCommentLikeStatus(likeCommentDto);
//   }
// }
