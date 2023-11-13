import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/api/user/services/user.service';
import { UserProtection } from 'src/schemas/user/user.schema';

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration:
        configService.get('environment') == 'production' ? false : true,
      secretOrKey: configService.get('JWT_SECRET_KEY_REFRESH_TOKEN'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({
      conditions: { _id: payload._id },
      projection: UserProtection.DEFAULT(),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      ...user,
    };
  }
}
