import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { LoggingMiddleware } from '../../common/middlewares/logger.middleware';
import { PostView } from './entities/post-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostView], )],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(PostsController);
  }
}
