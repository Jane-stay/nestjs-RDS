import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../../decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ListAllPostDto } from './dto/list-all-post.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostRoleGuard } from './guard/post-role.guard';

@ApiTags('포스트 관리')
@UseGuards(JwtAuthGuard) //jwt 토큰있는지 확인하고,
@ApiBearerAuth()
@Controller('posts')
@UseInterceptors(TransformInterceptor)
export class PostsController {
  private logger = new Logger(Controller.name);
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiBody({
    type: CreatePostDto,
  })
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @RequestUser() user: User,
  ) {
    createPostDto.user = user;
    return await this.postsService.create(createPostDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      file,
    };
  }

  @Get('/all')
  async findAllPosts(@Query() listAllPostDto: ListAllPostDto) {
    return await this.postsService.findAllPosts(listAllPostDto);
  }

  @Get()
  async findAll(@Query() listAllPostDto: ListAllPostDto) {
    return await this.postsService.findAll(listAllPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.findOne(id, user); //id 는 포스트아이디디
  }

  @UseGuards(PostRoleGuard)
  @ApiBody({
    type: UpdatePostDto,
  })
  @Patch(':PostId')
  update(@Param('PostId') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePostById(id, updatePostDto);
  }

  @UseGuards(PostRoleGuard)
  @Delete(':PostId')
  remove(@Param('PostId') id: string) {
    return this.postsService.removePostById(id);
  }
}
