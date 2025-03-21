import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppConfigModule } from '../../config/app/config.module';
import { AppConfigService } from '../../config/app/config.service';
import { S3Module } from '../s3/s3.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { SocialConfigModule } from 'src/config/social/config.module';

@Module({
  imports: [
    SocialConfigModule,
    AppConfigModule,
    UsersModule,
    S3Module,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
