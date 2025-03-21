import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { RequestUser } from '../../decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { ListAllCommentDto } from './dto/list-all-comment.dto';
import { CommentRoleGuard } from './guard/comment-role.guard';

@ApiTags('댓글 관리')
@UseGuards(JwtAuthGuard) //jwt 토큰있는지 확인하고,
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiParam({ name: 'postId', type: String, description: '댓글 등록' })
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @RequestUser() user: User,
  ) {
    return await this.commentsService.createComment(
      createCommentDto,
      postId,
      user,
    ); // 한줄이라 async await 이 필요없다. 기다려야 할 게 없어서서
  }

  @ApiParam({ name: 'postId', type: String })
  @ApiParam({ name: 'commentId', type: String })
  @Post(':commentId/replies')
  createReply(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @RequestUser() user: User,
  ) {
    return this.commentsService.createReply(
      createCommentDto,
      user,
      postId,
      commentId,
    );
  }

  // @Get()
  // async findAll(@Query() listAllCommentDto: ListAllCommentDto) {
  //   return this.commentsService.findAllComments(listAllCommentDto);
  // }
  @Get()
  @ApiParam({ name: 'postId', type: String, description: '댓글 가져오기' })
  async findAll(
    @Param('postId') postId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.commentsService.findCommentsByPostId(postId, limit);
  }

  @Patch(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @ApiParam({ name: 'postId', type: String, required: true })
  @ApiParam({ name: 'commentId', type: String, required: true })
  @Delete(':commentId')
  @UseGuards(CommentRoleGuard)
  removeComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    // postId는 사용하지 않지만 URL 패턴 일관성을 위해 받음
    return this.commentsService.removeComment(commentId);
  }
}
