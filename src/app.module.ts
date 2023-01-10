import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { settings } from './settings';

//blogs
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsQueryController } from './features/blogs/api/query.controller';
import { factoryBlogsService } from './features/blogs/factory/blogs.factory';
import { BlogsRepository } from './features/blogs/infrastructure/repository/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/repository/blogs.query.repository';
import { BlogItemType } from './features/blogs/infrastructure/blogs.type';
import { BlogsSchema } from './features/blogs/schema/blogs.schema';

//posts
import { PostsController } from './features/posts/api/posts.controller';
import { PostsQueryController } from './features/posts/api/query.controller';
import { factoryPostService } from './features/posts/factory/posts.factory';
import { PostsRepository } from './features/posts/infrastructure/repository/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/repository/posts.query.repository';
import { PostItemType } from './features/posts/infrastructure/posts.type';
import { PostsSchema } from './features/posts/schema/posts.schema';

// comments
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/repository/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/repository/comments.query.repository';
import {
  CommentSchema,
  Comment,
} from './features/comments/domain/entity/comments.schema';

//users
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/repository/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/repository/users.query.repository';
import {
  Users,
  UsersSchema,
} from './features/users/domain/entity/users.schema';

//auth
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';

//delete controller
import { DeleteController } from './features/delete/delete.controller';
import { JwtService } from '@nestjs/jwt';

//jwt
import { AuthJwtService } from './features/jwt/application/jwt.service';
import { JwtTokensQueryRepository } from './features/jwt/infrastructura/repository/jwt.query.repository';
import { JwtTokensRepository } from './features/jwt/infrastructura/repository/jwt.repository';
import { JwtTokens, JwtSchema } from './features/jwt/domain/jwt.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      settings.MONGO_URI +
        settings.MONGO_DB_NAME +
        '?retryWrites=true&w=majority',
      {},
    ),
    MongooseModule.forFeature([
      { name: BlogItemType.name, schema: BlogsSchema },
      { name: PostItemType.name, schema: PostsSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Users.name, schema: UsersSchema },
      { name: JwtTokens.name, schema: JwtSchema },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    BlogsController,
    BlogsQueryController,
    PostsController,
    PostsQueryController,
    CommentsController,
    DeleteController,
  ],
  providers: [
    AppService,
    //blogs
    factoryBlogsService(),
    BlogsRepository,
    BlogsQueryRepository,
    //posts
    factoryPostService(),
    PostsRepository,
    PostsQueryRepository,
    //comments
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    //users
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    //auth
    AuthService,
    JwtService, //from nest
    //jwt
    AuthJwtService,
    JwtTokensRepository,
    JwtTokensQueryRepository,
  ],
})
export class AppModule {}
