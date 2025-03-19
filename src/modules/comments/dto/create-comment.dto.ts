import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateCommentDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  commentContent: string;

  //   @ApiProperty({ type: 'string' })
  //   @IsString()
  //   postId: string;  postId 는 Param에서 받아온다.

  //   @ApiProperty({ type: 'string' })
  //   @IsString()
  //   user: User;
}
