import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from './../users/users.service';
import { User } from '../users/entities/user.entity';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { comparePassword, encryptPassword } from '../../utils/password-util';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
    private appConfigService: AppConfigService,
    private s3Service: S3Service,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<ResponseUserDto> {
    // signUpDto.password = (await encryptPassword(signUpDto.password)).toString();
    return await this.usersService.createUser(signUpDto);
  }

  async logIn(loginDto: LogInDto, requestDomain: string) {
    const { email, password } = loginDto;
    const user = await this.usersService.findUserByEmail(email);
    if (!(await comparePassword(password, user.password))) {
      throw new BadRequestException('Password 가 틀렸습니다');
    }
    const { accessToken, accessOption } = await this.setJwtAccessToken(
      email,
      requestDomain,
    );
    const { refreshToken, refreshOption } = this.setJwtRefreshToken(
      email,
      requestDomain,
    );
    return { accessToken, accessOption, refreshToken, refreshOption };
  }
  async setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 1 * 24 * 60 * 60 * 1000;
    const token = this.JwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge,
    });
    return {
      accessToken: token,
      accessOption: this.setCookieOption(maxAge, requestDomain),
    };
  }
  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 15 * 24 * 60 * 60 * 1000;
    const token = this.JwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge,
    });

    return {
      refreshToken: token,
      refreshOption: this.setCookieOption(maxAge, requestDomain),
    };
  }

  setCookieOption(maxAge: number, requestDomain: string) {
    let domain: string;

    if (
      requestDomain.includes('localhost') ||
      requestDomain.includes('127.0.0.1')
    ) {
      domain = 'localhost';
    } else {
      domain = requestDomain.split(':')[0];
    }
    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax' as 'lax',
    };
  }
  expireJwtToken(requestDomain: string) {
    return {
      accessOption: this.setCookieOption(0, requestDomain),
      refreshOption: this.setCookieOption(0, requestDomain),
    };
  }

  // async uploadProfile(file: Express.Multer.File) {
  //   await this.s3Service.uploadFile(file, 'user-profile');
  // }
}
