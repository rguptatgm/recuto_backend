import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { GenericAuthenticationService } from './core/generic.authentication.service';
import { JwtPrepareService } from './core/generic.jwt.prepare.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthenticationData,
  PreparedUserInfo,
} from 'src/globals/interfaces/global.interface';
import { SocialAuthenticationHelperService } from './core/social.authentication.helper.service';
import { UserRoleAssignService } from 'src/api/shared/userRoleAssign/services/user.role.assign.service';
import {
  RoleAlias,
  RoleMmbership,
  UserType,
} from 'src/globals/enums/global.enum';

@Injectable()
export class UserAuthenticationService extends GenericAuthenticationService<UserDocument> {
  constructor(
    protected readonly jwtPrepareService: JwtPrepareService<UserDocument>,
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    protected readonly socialAuthHelperService: SocialAuthenticationHelperService,
    private readonly userRoleAssignService: UserRoleAssignService,
  ) {
    super(jwtPrepareService, model, socialAuthHelperService);
  }

  async findUserByIdentifier(
    authenticationData: AuthenticationData,
    additionalCondition?: any,
  ): Promise<UserDocument> {
    const { email } = authenticationData.authDto;

    return await this.findOne({
      conditions: {
        email: email,
        ...additionalCondition,
      },
    });
  }

  prepareUserInfo(authData: AuthenticationData): PreparedUserInfo {
    const preapredUserInfo: PreparedUserInfo = {
      firstName: authData.authDto.firstName,
      deviceIdentifierID: authData.authDto.deviceIdentifierID,
      lastName: authData.authDto.lastName,
    };

    return preapredUserInfo;
  }

  async afterCreateOnSignUp(args: {
    userDocument: UserDocument;
    authData: AuthenticationData;
  }): Promise<void> {
    await this.userRoleAssignService.assignUserToRole({
      userID: args.userDocument._id,
      userRole: RoleAlias.APP_USER_NONE_RESOURCE,
      membership: RoleMmbership.NONE_RESOURCE,
      userType: UserType.USER,
    });
  }
}
