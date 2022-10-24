import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';
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
import { postsSchema } from './posts/schema/posts.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      settings.MONGO_URI +
        settings.MONGO_DB_NAME +
        '?retryWrites=true&w=majority',
      {},
    ),
    MongooseModule.forFeature([
      { name: BlogItemType.name, schema: BlogsSchema },
      { name: PostItemType.name, schema: postsSchema },
    ]),
  ],
  controllers: [
    AppController,
    UsersController,
    BlogsController,
    BlogsQueryController,
    PostsController,
    PostsQueryController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    factoryBlogsService(),
    BlogsRepository,
    BlogsQueryRepository,
    factoryPostService(),
    PostsRepository,
    PostsQueryRepository,
  ],
})
export class AppModule {}
