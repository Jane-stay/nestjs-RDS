import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ILike, Repository } from 'typeorm';
import {
  ListAllPostDto,
  OrderByOption,
  OrderOption,
} from './dto/list-all-post.dto';
import { ResponseListAllPostDto } from './dto/response-list-all-post.dto';
import { PostView } from './entities/post-view.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async findAllPosts(listAllPostDto: ListAllPostDto) {
    const { page, limit } = listAllPostDto;
    // const [data, total] = await this.postRepository.findAndCount({
    //   relations: ['user'],
    //   take: limit,
    //   skip: limit * (page - 1),
    // });

    const query = this.postRepository
      .createQueryBuilder('p')
      .orderBy('p.createdAt', 'DESC')
      .take(limit)
      .skip(limit * (page - 1))
      .leftJoinAndSelect('p.user', 'user')
      .select([
        'p.id',
        'p.title',
        // 'p.content', 전체 목록에서 내용을 다 보여줄 필요 없음음
        'p.createdAt',
        'p.thumbnailUrl',
        'p.views',
        'user.id',
        'user.name',
      ]);

    if (listAllPostDto.title) {
      query.andWhere('p.title LIKE :title', {
        title: `%${listAllPostDto.title}%`,
      });
    }
    if (listAllPostDto.content) {
      query.andWhere('p.content LIKE :content', {
        content: `%${listAllPostDto.content}%`,
      });
    }
    if (listAllPostDto.userId) {
      query.andWhere('p.userId = :user', { user: listAllPostDto.userId });
    }
    if (
      listAllPostDto.orderBy &&
      [OrderByOption.VIEWS, OrderByOption.CREATED_AT].includes(
        listAllPostDto.orderBy,
      )
    ) {
      query.orderBy(`p.${listAllPostDto.orderBy}`, listAllPostDto.order);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(options: ListAllPostDto) {
    const whereCondition: {}[] = [];
    if (options.title) {
      whereCondition.push({ title: ILike(`%${options.title}%`) });
    }
    if (options.content) {
      whereCondition.push({ content: ILike(`%${options.content}%`) });
    }
    const [data, total] = await this.postRepository.findAndCount({
      relations: ['user'],
      where: whereCondition.length ? whereCondition : {},
      take: options.limit,
      skip: options.limit * (options.page - 1),
      select: {
        user: {
          id: true,
          name: true,
        },
      },
    });
    return {
      data,
      total,
      page: +options.page,
      limit: +options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async findOne(id: string, user: User) {
    const data = await this.postRepository.findOne({ where: { id } });
    if (data) {
      const checkPostView = await this.postViewRepository.findOne({
        where: { user: { id: user.id }, post: { id: data.id } },
        order: { createdAt: OrderOption.DESC },
      });
      if (checkPostView) {
        if (Date.now() - checkPostView.createdAt.getTime() <= 60 * 10 * 1000) {
          return { data };
        }
      }
      const postView = this.postViewRepository.create({
        post: data,
        user: user,
      });
      await this.postViewRepository.save(postView);
      // data.views++;
      // await this.postRepository.save(data);
    }
    return { data };
  }

  async findPostById(id: string) {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  async updatePostById(postId: string, updatePostDto: UpdatePostDto) {
    const result = await this.postRepository.update(postId, updatePostDto);
    if (result.affected === 0) {
      throw new NotFoundException('해당 댓글 없음');
    }
    return result;
  }

  async removePostById(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
          });

    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    const result = await this.postRepository.remove(post);

    return {
      message: '포스트가 삭제되었습니다.',
      result,
    };
  }
}
