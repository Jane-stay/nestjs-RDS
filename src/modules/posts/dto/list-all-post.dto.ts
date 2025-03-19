import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum OrderOption {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum OrderByOption {
  CREATED_AT = 'createdAt',
  VIEWS = 'views',
}

export class ListAllPostDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  content: string;

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
