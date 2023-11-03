import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtPrepareService } from './services/core/generic.jwt.prepare.service';
import { JwtStrategyRefresh } from './strategies/jwt.strategy.refresh';
import { UserRoleAssignModule } from 'src/api/shared/userRoleAssign/user.role.assign.module';
import { UserAuthenticationService } from './services/user.authentication.service';
import { SocialAuthenticationHelperService } from './services/core/social.authentication.helper.service';

@Module({
  imports: [
    UserRoleAssignModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    UserAuthenticationService,
    JwtStrategy,
    JwtStrategyRefresh,
    JwtPrepareService,
    SocialAuthenticationHelperService,
  ],
  exports: [JwtPrepareService],
})
export class AuthenticationModule {}
