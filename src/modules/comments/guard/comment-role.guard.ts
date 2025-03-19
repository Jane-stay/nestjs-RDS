import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from 'src/common/enum';

@Injectable()
export class CommentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const commentId = request.params.commentId;

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'], //커서 추가
    });

    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }

    return user.id === comment.user.id || user.role === UserRole.ADMIN;
  }
}
