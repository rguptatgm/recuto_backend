import { BadRequestException, Injectable } from '@nestjs/common';

import { Document, Model } from 'mongoose';
import { JwtPrepareService } from './jwt.prepare.service';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';
import { AccountKind } from 'src/globals/enums/global.enum';
import { GenericAuthenticationHelperService } from './generic.authentication.helper.service';
import { AuthenticationData } from 'src/globals/interfaces/global.interface';

@Injectable()
export abstract class GenericAuthenticationService<T extends Document> {
  protected crudService: GenericCrudService<T>;

  constructor(
    protected readonly jwtPrepareService: JwtPrepareService,
    protected readonly model: Model<T>,
    protected readonly authenticationHelperService: GenericAuthenticationHelperService<T>,
  ) {
    this.crudService = new GenericCrudService<T>(model);
  }

  abstract findUserByIdentifier(
    authenticationData: AuthenticationData,
  ): Promise<T | null>;

  async signIn(args: { authData: AuthenticationData }) {
    // Verify user information
    const preparedAuthData =
      await this.authenticationHelperService.verifyAndGetUserInformationForType(
        {
          authData: args.authData,
        },
      );

    // Find user by email and social uid if the account kind is not internal
    const user = await this.authenticationHelperService.findAndVerifyUser({
      preparedAuthData: preparedAuthData,
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
      user: user,
      kind: preparedAuthData.kind,
    });

    return jwtResponse;
  }

  async signUp(args: { authData: AuthenticationData }) {
    // Check if user with email exists
    const user =
      await this.authenticationHelperService.findUniqueUserByIdentifierForKind({
        authData: args.authData,
      });

    // If user does not exist create user
    if (!user) {
      const userInformation =
        await this.authenticationHelperService.verifyAndGetUserInformationForType(
          {
            authData: args.authData,
          },
        );

      const accountInfo =
        await this.authenticationHelperService.prepareAccountForKind({
          authInfo: userInformation,
        });

      const document = {
        email: userInformation.email,
        firstName: userInformation.userInfo.firstName,
        lastName: userInformation.userInfo.lastName,
        deviceIdentifierID: userInformation.userInfo.deviceIdentifierID,
        accounts: [accountInfo],
      };

      await this.crudService.create({
        document: document,
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
    const userInformation =
      await this.authenticationHelperService.verifyAndGetUserInformationForType(
        {
          authData: args.authData,
        },
      );

    // check if kind in accounts array already exists. if yes check if social and sign in otherwise throw error
    // if kind does not exist push it to accounts array but only if kind is social

    const account = (args?.userDocuemnt as any)?.accounts.find(
      (account) => account.kind === userInformation.kind,
    );

    // Check if social and sign in otherwise throw error
    if (account) {
      if (account.kind === AccountKind.INTERNAL) {
        throw new BadRequestException('Account already exists');
      }

      return this.signIn({ authData: args.authData });
    }

    // If kind does not exist push it to accounts array but only if kind is social
    if (userInformation.kind === AccountKind.INTERNAL) {
      throw new BadRequestException('Account already exists');
    }

    const accountInfo =
      await this.authenticationHelperService.prepareAccountForKind({
        authInfo: userInformation,
      });

    (args.userDocuemnt as any).accounts.push(accountInfo);

    await this.crudService.updateOne({
      conditions: { _id: args.userDocuemnt._id } as any,
      changes: { accounts: (args.userDocuemnt as any)?.accounts },
    });

    return this.signIn({ authData: args.authData });
  }
}
