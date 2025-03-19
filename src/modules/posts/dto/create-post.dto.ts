import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  content: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  thumbnailUrl: string;

  user?: User;
}
