import { BaseEntity } from '../../../common/entities/base.entity';
import { BeforeInsert, Entity, getRepository, ManyToOne, OneToOne, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity()
export class PostView extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  
}
