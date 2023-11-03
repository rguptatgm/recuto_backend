import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { UserService } from 'src/api/user/services/user.service';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import { UserType } from 'src/globals/enums/global.enum';
import { UserProtection } from 'src/schemas/user/user.schema';

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly userRoleAssignService: UserRoleAssignService,
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

    const userPermissions =
      await this.userRoleAssignService.getUserPermissionsForAllResources({
        userID: payload._id,
        permissionType: PermissionType.APP_SERVER,
        userType: UserType.USER,
      });

    return {
      ...user,
      permissions: userPermissions,
    };
  }
}
