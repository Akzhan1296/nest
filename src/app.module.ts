import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/api/blogs.controller';
import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';
import { BlogsQueryController } from './blogs/api/query.controller';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs.repository';
import { PostsRepository } from './posts/infrastructure/repository/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { settings } from './settings';
import { BlogType } from './blogs/infrastructure/blogs.type';
import { factoryBlogsService } from './blogs/factory/blogs.service';
import { BlogsSchema } from './blogs/schema/blogs.schema';
import { BlogsQueryRepository } from './blogs/infrastructure/repository/blogs.query.repository';
@Module({
  imports: [
    MongooseModule.forRoot(
      settings.MONGO_URI +
        settings.MONGO_DB_NAME +
        '?retryWrites=true&w=majority',
      {},
    ),
    MongooseModule.forFeature([{ name: BlogType.name, schema: BlogsSchema }]),
  ],
  controllers: [
    AppController,
    UsersController,
    BlogsController,
    BlogsQueryController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    factoryBlogsService(),
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
  ],
})
export class AppModule {}
