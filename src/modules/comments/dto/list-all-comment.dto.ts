import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderByOption, OrderOption } from 'src/common/enum';

export class ListAllCommentDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: '댓글' })
  commmentContent: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  postId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userId: string; //uuid

  @IsEnum(OrderByOption)
  @IsOptional()
  @ApiProperty({
    required: false,
    default: OrderByOption.CREATED_AT,
    enum: OrderByOption,
  })
  orderBy: OrderByOption = OrderByOption.CREATED_AT;

  @IsEnum(OrderOption)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: OrderOption,
    description: '정렬방식',
    default: OrderOption.DESC,
  })
  order: OrderOption = OrderOption.DESC;
}
