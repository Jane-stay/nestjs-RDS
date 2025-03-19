import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { PostViewSubscriber } from './modules/posts/subscribers/post-view.subscriber';
import { CommentSubscriber } from './modules/comments/subscribers/comment.subscriber';
import { UserSubscriber } from './modules/users/subscribers/user.subscribe';

dotenv.config();

const entity = join(__dirname, '/**/*.entity{.ts,.js}');
const migration = join(__dirname, './migrations/**/*{.ts,.js}');
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),

  // host: 'localhost',
  // port: 5432,
  // username: 'postgres',
  // password: 'sohyun',
  // database: 'nest_test',
  entities: [entity],
  synchronize: false,
  migrations: [migration],
  logging: true,
  subscribers: [PostViewSubscriber, CommentSubscriber, UserSubscriber],
});
