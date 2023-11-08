import { BadRequestException, Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { JwtPrepareService } from './generic.jwt.prepare.service';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { AccountKind } from 'src/globals/enums/global.enum';
import {
  AuthenticationData,
  PreparedAuthData,
  PreparedUserInfo,
} from 'src/globals/interfaces/global.interface';
import {
  checkIfPasswordIsValid,
  hashPassword,
} from 'src/globals/helper/bcrypt.password.helper';
import { UserAccount } from 'src/schemas/user/user.account.schema';
import { SocialAuthenticationHelperService } from './social.authentication.helper.service';

@Injectable()
export abstract class GenericAuthenticationService<
  T extends Document,
> extends GenericCrudService<T> {
  constructor(
    protected readonly jwtPrepareService: JwtPrepareService<T>,
    protected readonly model: Model<T>,
    protected readonly socialAuthHelperService: SocialAuthenticationHelperService,
  ) {
    super(model);
  }

  abstract findUserByIdentifier(
    authenticationData: AuthenticationData,
    additionalCondition?: any,
  ): Promise<T | null>;

  protected prepareUserInfo(authData: AuthenticationData): PreparedUserInfo {
    const preapredUserInfo: PreparedUserInfo = {
      firstName: authData.authDto.firstName,
      deviceIdentifierID: authData.authDto.deviceIdentifierID,
      lastName: authData.authDto.lastName,
    };

    return preapredUserInfo;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async afterCreateOnSignUp(args: {
    userDocument: T;
    authData: AuthenticationData;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }): Promise<void> {}

  async signIn(args: { authData: AuthenticationData }) {
    //Verify user information
    const preparedAuthData = await this.verifyAndGetUserInformationForType({
      authData: args.authData,
    });

    // merge auth data with prepared auth data
    const authData: AuthenticationData = {
      ...args.authData,
      preparedAuthData,
    };

    // Find user by email and social uid if the account kind is not internal
    const user = await this.findAndVerifyUser({
      authData,
    });

    // If type internal and user does not exist throw error
    if (preparedAuthData.kind === AccountKind.INTERNAL && !user) {
      throw new BadRequestException('User not found');
    }

    // If type social account and user does not exist create user
    if (preparedAuthData.kind !== AccountKind.INTERNAL && !user) {
      return this.signUp(args);
    }

    // prepare JWT response
    const jwtResponse = await this.jwtPrepareService.prepareJwtResponse({
      userDocument: user,
      kind: preparedAuthData.kind,
    });

    return jwtResponse;
  }

  async signUp(args: { authData: AuthenticationData }) {
    // Check if user with email exists
    const user = await this.findUniqueUserByIdentifierForKind({
      authData: args.authData,
    });

    // If user does not exist create user
    if (!user) {
      const preparedAuthData = await this.verifyAndGetUserInformationForType({
        authData: args.authData,
      });

      const userAccount = await this.prepareAccountForKind({
        authInfo: preparedAuthData,
      });

      const createdUser = await this.create({
        document: {
          email: preparedAuthData.email,
          ...preparedAuthData.userInfo,
          accounts: [userAccount],
        },
      });

      await this.afterCreateOnSignUp({
        authData: args.authData,
        userDocument: createdUser,
      });

      // Sign in new user
      return this.signIn(args);
    }

    // Otherwise check if user with specific account kind exists
    return this.handleExistingUserSignUp({
      authData: args.authData,
      userDocuemnt: user,
    });
  }

  async handleExistingUserSignUp(args: {
    authData: AuthenticationData;
    userDocuemnt: T;
  }) {
    const preparedAuthData = await this.verifyAndGetUserInformationForType({
      authData: args.authData,
    });

    // check if kind in accounts array already exists. if yes check if social and sign in otherwise throw error
    // if kind does not exist push it to accounts array but only if kind is social
    const account = (args?.userDocuemnt as any)?.accounts.find(
      (account) => account.kind === preparedAuthData.kind,
    );

    // Check if social and sign in otherwise throw error
    if (account) {
      if (account.kind === AccountKind.INTERNAL) {
        throw new BadRequestException('Account already exists');
      }
      return this.signIn({ authData: args.authData });
    }

    // If kind does not exist push it to accounts array but only if kind is social
    if (preparedAuthData.kind === AccountKind.INTERNAL) {
      throw new BadRequestException('Account already exists');
    }

    const userAccount = await this.prepareAccountForKind({
      authInfo: preparedAuthData,
    });

    (args.userDocuemnt as any).accounts.push(userAccount);

    await this.updateOne({
      conditions: { _id: args.userDocuemnt._id } as any,
      changes: { accounts: (args.userDocuemnt as any)?.accounts },
    });

    return this.signIn({ authData: args.authData });
  }

  private async findUniqueUserByIdentifierForKind(args: {
    authData: AuthenticationData;
  }): Promise<T | null> {
    switch (args.authData.authDto.kind) {
      case AccountKind.INTERNAL:
        return await this.findUserByIdentifier(args.authData);
      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        const preparedAuthData = await this.verifyAndGetUserInformationForType({
          authData: args.authData,
        });
        return await this.findUserByIdentifier({
          ...args.authData,
          preparedAuthData,
        });
    }
  }

  private async verifyAndGetUserInformationForType(args: {
    authData: AuthenticationData;
  }): Promise<PreparedAuthData> {
    const { kind } = args.authData.authDto;

    switch (kind) {
      case AccountKind.GOOGLE:
        const googleUserInformation =
          await this.socialAuthHelperService.verifyGoogleToken({
            authenticationData: args.authData,
            prepareUserInfoFn: this.prepareUserInfo,
          });

        return googleUserInformation;

      case AccountKind.APPLE:
        const appleUserInformation =
          await this.socialAuthHelperService.verifyAppleToken({
            authenticationData: args.authData,
            prepareUserInfoFn: this.prepareUserInfo,
          });

        return appleUserInformation;

      case AccountKind.INTERNAL:
        const authData: PreparedAuthData = {
          kind: AccountKind.INTERNAL,
          email: args.authData.authDto.email,
          password: args.authData.authDto.password,
          userInfo: this.prepareUserInfo(args.authData),
        };

        if (!authData?.email || !authData?.password) {
          throw new BadRequestException('Invalid credentials');
        }

        return authData;

      default:
        throw new BadRequestException('Invalid account kind');
    }
  }

  private async findAndVerifyUser(args: {
    authData: AuthenticationData;
  }): Promise<T> {
    const authInfo = args.authData.preparedAuthData;

    let user: any;
    switch (authInfo.kind) {
      case AccountKind.INTERNAL:
        user = await this.findUserByIdentifier(args.authData);

        if (!user) {
          throw new BadRequestException('invalid credentials');
        }

        // get internal account for password validation
        const internalAccount = user.accounts.find(
          (account) => account.kind == AccountKind.INTERNAL,
        );

        // Check if password is valid
        const valid = await checkIfPasswordIsValid({
          storedPassword: internalAccount.password,
          reqPassword: authInfo.password,
        });

        if (!valid) {
          throw new BadRequestException('invalid credentials');
        }
        break;

      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        // find user by identifier and social credentials
        user = await this.findUserByIdentifier(args.authData, {
          'accounts.socialUid': authInfo.socialUid,
          'accounts.kind': authInfo.kind,
        });
        break;

      default:
        throw new BadRequestException('Invalid account kind');
    }

    // Secure user
    user = await this.findOne({
      conditions: {
        _id: user._id,
      } as any,
      // projection: UserProtection.DEFAULT(), // TODO add dynamic projection for all finds
    });

    return user;
  }

  private async prepareAccountForKind(args: {
    authInfo: PreparedAuthData;
  }): Promise<UserAccount> {
    const authInfo = args.authInfo;

    let account: any;

    switch (authInfo.kind) {
      case AccountKind.INTERNAL:
        account = {
          kind: authInfo.kind,
          password: await hashPassword(authInfo.password),
        };
        break;

      case AccountKind.GOOGLE:
      case AccountKind.APPLE:
        account = {
          kind: authInfo.kind,
          socialUid: authInfo.socialUid,
        };
        break;

      default:
        throw new BadRequestException('Invalid account kind');
    }

    return account;
  }
}
