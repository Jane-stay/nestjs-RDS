import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterType } from 'src/common/enum';

export class SignUpDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  socialId?: string;

  @IsEnum(RegisterType)
  @IsOptional()
  registerType: RegisterType;
}
