import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import { UserService } from 'src/api/user/services/user.service';
import { PermissionType } from 'src/globals/enums/application.permission.enum';
import { RoleMmbership, UserType } from 'src/globals/enums/global.enum';
import { RequestUser } from 'src/globals/interfaces/global.interface';
import { UserProtection } from 'src/schemas/user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly userRoleAssignService: UserRoleAssignService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:
        configService.get('environment') == 'production' ? false : true,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({
      conditions: { _id: payload?.user?._id },
      projection: UserProtection.DEFAULT(),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userPermissions =
      await this.userRoleAssignService.getUserPermissionsForAllResources({
        userID: payload._id,
        permissionType: PermissionType.APP_SERVER,
        membership: RoleMmbership.USER,
        userType: UserType.USER,
      });

    return {
      ...user,
      permissions: userPermissions,
    } as RequestUser;
  }
}
