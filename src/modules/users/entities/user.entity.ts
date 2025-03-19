import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { UserRole } from 'src/common/enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column() //{select: false}
  password: string;

  @Column()
  name: string;

  @Column({enum: UserRole, default: UserRole.COMMON})
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
