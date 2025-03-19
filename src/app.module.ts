import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './ormconfig';
import { UsersModule } from './modules/users/users.module';

import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { PostsModule } from './modules/posts/posts.module';
import { WinstonLoggerModule } from './modules/logger/winston-logger.module';
import { DbConfigModule } from './config/db/config.module';
import { DbConfigService } from './config/db/config.service';
import { join } from 'path';
import { AppConfigModule } from './config/app/config.module';
import { S3Module } from './modules/s3/s3.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PostViewSubscriber } from './modules/posts/subscribers/post-view.subscriber';
import { CommentSubscriber } from './modules/comments/subscribers/comment.subscriber';
import { UserSubscriber } from './modules/users/subscribers/user.subscribe';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (configService: DbConfigService) => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUser,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, './migrations/**/*{.ts,.js}')],
        synchronize: configService.nodeEnv === 'dev',
        subscribers: [PostViewSubscriber, CommentSubscriber, UserSubscriber], //
      }),

      inject: [DbConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    WinstonLoggerModule,
    AppConfigModule,
    S3Module,
    CommentsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
