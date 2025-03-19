import { IsNumber, IsString } from 'class-validator';

export class ResponseUserDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  name: string;
}
