import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from 'src/common/enum';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const postId = request.params.postId;

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    return user.id === post.user.id || user.role === UserRole.ADMIN;
  }
}
