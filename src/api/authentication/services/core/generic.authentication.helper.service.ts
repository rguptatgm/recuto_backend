import { Injectable, BadRequestException } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { AccountKind } from 'src/globals/enums/global.enum';
import {
  PreparedAuthData,
  AuthenticationData,
} from 'src/globals/interfaces/global.interface';
import {
  checkIfPasswordIsValid,
  hashPassword,
} from 'src/globals/helper/bcrypt.password.helper';
import { SocialAuthenticationHelperService } from './social.authentication.helper.service';
import { GenericAuthenticationService } from './generic.authentication.service';
import { UserAccount } from 'src/schemas/user/user.account.schema';

@Injectable()
export abstract class GenericAuthenticationHelperService<T extends Document> {
  protected crudService: GenericCrudService<T>;
  constructor(
    protected readonly model: Model<T>,
    protected readonly socialAuthHelperService: SocialAuthenticationHelperService,
    protected readonly authService: GenericAuthenticationService<T>,
  ) {
    this.crudService = new GenericCrudService<T>(model);
  }

  async findUniqueUserByIdentifierForKind(args: {
    authData: AuthenticationData;
  }): Promise<T | null> {
    switch (args.authData.authDto.kind) {
      case AccountKind.INTERNAL:
        return await this.authService.findUserByIdentifier(args.authData);

      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        const preparedAuthData = await this.verifyAndGetUserInformationForType({
          authData: args.authData,
        });

        return await this.authService.findUserByIdentifier({
          ...args.authData,
          preparedAuthData,
        });
    }
  }

  async verifyAndGetUserInformationForType(args: {
    authData: AuthenticationData;
  }): Promise<PreparedAuthData> {
    const { kind } = args.authData.authDto;

    switch (kind) {
      case AccountKind.GOOGLE:
        const googleUserInformation =
          await this.socialAuthHelperService.verifyGoogleToken({
            authenticationData: args.authData,
          });

        return googleUserInformation;

      case AccountKind.APPLE:
        const appleUserInformation =
          await this.socialAuthHelperService.verifyAppleToken({
            authenticationData: args.authData,
          });

        return appleUserInformation;

      case AccountKind.INTERNAL:
        const authData: PreparedAuthData = {
          kind: AccountKind.INTERNAL,
          email: args.authData.authDto.email,
          userInfo: {
            deviceIdentifierID: args.authData.authDto.deviceIdentifierID,
            password: args.authData.authDto.password,
          },
        };

        if (!authData?.email || !authData?.userInfo?.password) {
          throw new BadRequestException('Invalid credentials');
        }

        return authData;

      default:
        throw new BadRequestException('Invalid account kind');
    }
  }

  async findAndVerifyUser(args: {
    preparedAuthData: PreparedAuthData;
  }): Promise<T> {
    const authInfo = args.preparedAuthData;

    let user: any;
    switch (authInfo.kind) {
      case AccountKind.INTERNAL:
        const internalCondition = {
          email: authInfo.email,
        };

        user = await this.crudService.findOne({
          conditions: internalCondition as any,
        });

        // get internal account for password validation
        const internalAccount = user.accounts.find(
          (account) => account.kind == AccountKind.INTERNAL,
        );

        // Check if password is valid
        const valid = await checkIfPasswordIsValid({
          storedPassword: internalAccount.password,
          reqPassword: authInfo.userInfo.password,
        });

        if (!valid) {
          throw new BadRequestException('invalid credentials');
        }
        break;

      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        const socialCondition = {
          email: authInfo.email,
          'accounts.socialUid': authInfo.userInfo.socialUid,
          'accounts.kind': authInfo.kind,
        };

        user = await this.crudService.findOne({
          conditions: socialCondition as any,
        });
        break;

      default:
        throw new BadRequestException('Invalid account kind');
    }

    // Secure user
    user = await this.crudService.findOne({
      conditions: {
        _id: user._id,
      } as any,
      // projection: UserProtection.DEFAULT(), // TODO add dynamic projection for all finds
    });

    return user;
  }

  async prepareAccountForKind(args: {
    authInfo: PreparedAuthData;
  }): Promise<UserAccount> {
    const authInfo = args.authInfo;

    let account: any;

    switch (authInfo.kind) {
      case AccountKind.INTERNAL:
        account = {
          kind: authInfo.kind,
          password: await hashPassword(authInfo.userInfo.password),
        };
        break;

      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        account = {
          kind: authInfo.kind,
          socialUid: authInfo.userInfo.socialUid,
        };
        break;

      default:
        throw new BadRequestException('Invalid account kind');
    }

    return account;
  }
}
