import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtPrepareService } from './services/core/generic.jwt.prepare.service';
import { JwtStrategyRefresh } from './strategies/jwt.strategy.refresh';
import { SocialAuthenticationHelperService } from './services/core/social.authentication.helper.service';
import { UserRoleAssignModule } from '../shared/userRoleAssign/user.role.assign.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { UserAuthenticationService } from './services/user.authentication.service';

@Module({
  imports: [
    UserModule,
    UserRoleAssignModule,
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
  exports: [],
})
export class AuthenticationModule {}
