import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';

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
import { CommentsRepository } from './features/comments/infrastructure/repository/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/repository/comments.query.repository';
import {
  CommentSchema,
  Comment,
} from './features/comments/domain/entity/comments.schema';

//users
import { UsersController } from './features/users/api/users.controller';
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
import { JwtTokensQueryRepository } from './features/jwt/infrastructura/repository/jwt.query.repository';
import { JwtTokensRepository } from './features/jwt/infrastructura/repository/jwt.repository';
import { JwtTokens, JwtSchema } from './features/jwt/domain/jwt.schema';

//devices
import { DevicesController } from './features/devices/api/devices.controller';

//ips
import { BlockIpsService } from './features/ips/application/ips.service';
import { BlockIpsRepository } from './features/ips/infrastructure/ips.repository';
import { BlockIpsQueryRepository } from './features/ips/infrastructure/ips.query.repository';
import { BlockIps, BlockIpsSchema } from './features/ips/domain/ips.schema';

//use-cases
import { LoginUseCase } from './features/auth/application/use-cases/login-use-case';
import { UpdateUserRefreshTokenUseCase } from './features/auth/application/use-cases/update-refresh-token-use-case';
import { NewPasswordUseCase } from './features/auth/application/use-cases/new-password-use-case';
import { PasswordRecoveryUseCase } from './features/auth/application/use-cases/password-recovery-use-case';
import { RegistrationConfirmationUseCase } from './features/auth/application/use-cases/registration-confirmation-use-case';
import { EmailResendingUseCase } from './features/auth/application/use-cases/registration-email-resendings-use-case';
import { RegistrationUserUseCase } from './features/auth/application/use-cases/registration-user-use-case';
import { CreateUserUseCase } from './features/users/application/use-cases/create-user-use-case';
import { DeleteUserUseCase } from './features/users/application/use-cases/delete-user-use-case';
import { CreateRefreshTokenUseCase } from './features/jwt/application/use-cases/create-refresh-token-use-case';
import { CreateAccessTokenUseCase } from './features/jwt/application/use-cases/create-access-token-use-case';
import { CreateCommentUseCase } from './features/comments/application/use-cases/create-comment-use-case';
import { DeleteCommentUseCase } from './features/comments/application/use-cases/delete-comment-use-case';
import { UpdateCommentUseCase } from './features/comments/application/use-cases/update-comment-use-case';
import { UpdateRefreshTokenUseCase } from './features/jwt/application/use-cases/update-refresh-token-use-case';
import { DeleteCurrentDeviceUseCase } from './features/devices/application/use-cases/delete-current-device-use-case';
import { DeleteDevicesExceptOneUseCase } from './features/devices/application/use-cases/delete-all-device-use-case';

const authUseCases = [
  LoginUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  RegistrationConfirmationUseCase,
  EmailResendingUseCase,
  RegistrationUserUseCase,
  UpdateUserRefreshTokenUseCase,
];
const usersUseCases = [CreateUserUseCase, DeleteUserUseCase];
const commentsUseCases = [
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
];
const jwtUseCases = [
  CreateRefreshTokenUseCase,
  CreateAccessTokenUseCase,
  UpdateRefreshTokenUseCase,
];
const devicesUseCases = [
  DeleteCurrentDeviceUseCase,
  DeleteDevicesExceptOneUseCase,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
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
      { name: BlockIps.name, schema: BlockIpsSchema },
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
    DevicesController,
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
    // CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    //users
    // UsersService,
    UsersRepository,
    UsersQueryRepository,
    //auth
    AuthService,
    JwtService, //from nest
    //jwt
    // AuthJwtService,
    JwtTokensRepository,
    JwtTokensQueryRepository,
    //ips
    BlockIpsService,
    BlockIpsRepository,
    BlockIpsQueryRepository,
    // use cases
    ...authUseCases,
    ...usersUseCases,
    ...commentsUseCases,
    ...jwtUseCases,
    ...devicesUseCases,
  ],
})
export class AppModule {}
