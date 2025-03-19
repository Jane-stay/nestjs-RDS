import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { Comment } from './entities/comment.entity';
import { ListAllCommentDto } from './dto/list-all-comment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    private postsService: PostsService, // post레포지토리 불러 오지 않고 서비스 로직 활용하기기
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ) {
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      commentContent: createCommentDto.commentContent,
      user,
      post,
    });

    return await this.commentRepository.save(comment);
  }

  async createReply(
    createCommentDto: CreateCommentDto,
    user: User,
    postId: string,
    commentId: string,
  ) {
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    const parent = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!parent) {
      throw new NotFoundException('댓글글을 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      commentContent: createCommentDto.commentContent,
      user,
      post, // post 정보 입력 안하면, 나중에 postId 기준으로 댓글들 조회할 경우, 대댓글도 같이 나오나?
      parent,
    });

    return await this.commentRepository.save(comment);
  }

  async findAllComments(listAllCommentDto: ListAllCommentDto) {
    const { page, limit } = listAllCommentDto;
    const query = this.commentRepository
      .createQueryBuilder('c')
      .orderBy('c.createdAt', 'DESC')
      .take(limit)
      .skip(limit * (page - 1))
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .select([
        'c.id',
        'c.commentContent',
        'c.createdAt',
        'post.id',
        'user.id',
      ]);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findCommentsByPostId(postId: string, limit: number) {
    // const data = await this.commentRepository.find({
    //   relations: ['user', 'replies', 'replies.user'],
    //   where: { post: { id: postId }, parent: IsNull() },
    //   take: limit,
    //   select: {
    //     user: {
    //       id: true,
    //       name: true,
    //     },
    //     replies: {
    //       id: true,
    //       commentContent: true,
    //       createdAt: true,
    //       user: {
    //         id: true,
    //         name:true
    //       }
    //   },
    // }});
    const data = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .leftJoin('c.replies', 'r')
      .leftJoin('r.user', 'ru')
      .andWhere('c.postId = :postId', { postId })
      .andWhere('c.parentId IS NULL')
      .select([
        'c.id',
        'c.commentContent',
        'c.createdAt',
        'u.id',
        'u.name',
        'r.id',
        'r.commentContent',
        'r.createdAt',
        'ru.id',
        'ru.name',
      ])
      .take(limit)
      .getMany();

    return { data };
  }

  async findOne(postId: string) {
    const data = await this.commentRepository.findOne({
      where: {
        post: { id: postId },
      },
    });
    return { data };
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    // const comment = await this.commentRepository.findOne({
    //   where: { id: commentId },
    // });
    // if (!comment) {
    //   throw new NotFoundException('해당 댓글이 없습니다.');
    // }
    // comment.commentContent = updateCommentDto.commentContent;
    // return await this.commentRepository.save(comment);
    const result = await this.commentRepository.update(commentId, {
      commentContent: updateCommentDto.commentContent,
    });
    if (result.affected === 0) {
      //아이디 못찾아 못바꿨다.
      throw new NotFoundException('해당 댓글 없음');
    }
    return result;
  }

  // async removeComment(commentId: string) {
  //   // const comment = await this.commentRepository.find({where: {id: commentId}});
  //   // if (!comment) {
  //   //     throw new NotFoundException('해당 댓글이 없습니다.');
  //   //   }
  //   // await this.commentRepository.remove(comment)
  //   // return {message: '댓글이 삭제되었습니다'};
  //   const result = await this.commentRepository.delete(commentId);
  //   if(result.affected === 0) {
  //     throw new NotFoundException('댓글 없음')
  //   }
  //   return result;
  // }
  async removeComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post', 'replies'], 
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const result = await this.commentRepository.remove(comment);

    return {
      message: '댓글이 삭제되었습니다.',
      result,
    };
  }
}
