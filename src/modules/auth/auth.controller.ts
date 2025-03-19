import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LogInDto } from './dto/log-in.dto';
import { Response, Request } from 'express';
import { RequestOrigin } from '../../decorators/request-origin.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sign } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestUser } from '../../decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('유저인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: SignUpDto,
  })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @ApiBearerAuth()
  @ApiBody({
    type: LogInDto,
  })
  @Post('login')
  async login(
    @Body() loginDto: LogInDto,
    @Res() res: Response,
    @RequestOrigin() origin,
  ) {
    const { accessToken, accessOption, refreshToken, refreshOption } =
      await this.authService.logIn(loginDto, origin);
    console.log(1, accessToken);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return res.json({
      message: '로그인성공!',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@Res() res: Response, @RequestOrigin() origin) {
    const { accessOption, refreshOption } =
      this.authService.expireJwtToken(origin);
    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
    res.json({
      message: '로그아웃',
    });
  }

  @Get('csrf')
  getCsrf(@Req() req: Request) {
    return { csrfToken: req.csrfToken() };
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload-profile')
  // async uploadProfile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @RequestUser() user: User,
  // ) {
  //   const result = await this.authService.uploadProfile(file);
  //   return { resultUrl: result };
  // }
}
