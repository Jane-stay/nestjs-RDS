import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret!,
    });
  }

  async validate(payload: any) {
    try {
      const { sub } = payload;
      const user = await this.usersService.findUserByEmail(sub);
      const { password, ...rest } = user;
      return rest;
    } catch (err) {
      throw new ForbiddenException('알 수 없는 에러 발생'); //forbidden 은 403 에러. 인가실패
    }
  }
}
