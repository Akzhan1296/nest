import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { settings } from './settings';

//blogs
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsQueryController } from './blogs/api/query.controller';
import { factoryBlogsService } from './blogs/factory/blogs.factory';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repository/blogs.query.repository';
import { BlogItemType } from './blogs/infrastructure/blogs.type';
import { BlogsSchema } from './blogs/schema/blogs.schema';

//posts
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryController } from './posts/api/query.controller';
import { factoryPostService } from './posts/factory/posts.factory';
import { PostsRepository } from './posts/infrastructure/repository/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/repository/posts.query.repository';
import { PostItemType } from './posts/infrastructure/posts.type';
import { PostsSchema } from './posts/schema/posts.schema';

// comments
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/repository/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/repository/comments.query.repository';
import {
  CommentSchema,
  Comment,
} from './comments/domain/entity/comments.schema';

//users
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/repository/users.repository';
import { UsersQueryRepository } from './users/infrastructure/repository/users.query.repository';
import { Users, UsersSchema } from './users/domain/entity/users.schema';

//auth
import { AuthController } from './auth/api/auth.controller';
import { AuthService } from './auth/application/auth.service';

//delete controller
import { DeleteController } from './delete/delete.controller';
import { JwtService } from '@nestjs/jwt';

//jwt
import { AuthJwtService } from './jwt/application/jwt.service';
import { JwtTokensQueryRepository } from './jwt/infrastructura/repository/jwt.query.repository';
import { JwtTokensRepository } from './jwt/infrastructura/repository/jwt.repository';
import { JwtTokens, JwtSchema } from './jwt/domain/jwt.schema';

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
