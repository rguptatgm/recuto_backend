import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PreparedAuthData,
  AuthenticationData,
  PreparedUserInfo,
} from '../../../../globals/interfaces/global.interface';
import {
  AccountKind,
  PlatformKind,
} from '../../../../globals/enums/global.enum';
import verifyAppleToken from 'verify-apple-id-token';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class SocialAuthenticationHelperService {
  constructor(private readonly configService: ConfigService) {}

  async verifyGoogleToken(args: {
    authenticationData: AuthenticationData;
    prepareUserInfoFn: (authData: AuthenticationData) => PreparedUserInfo;
  }): Promise<PreparedAuthData> {
    const { socialVerifyToken, platform } = args.authenticationData.authDto;

    try {
      let googleSignInClientId = this.configService.get(
        'GOOGLE_SIGNIN_WEB_CLIENT_ID',
      );

      switch (platform) {
        case PlatformKind.ANDROID:
          googleSignInClientId = this.configService.get(
            'FIREBASE_ANDROID_CLIENT_ID',
          );
          break;

        case PlatformKind.IOS:
          googleSignInClientId = this.configService.get(
            'FIREBASE_IOS_CLIENT_ID',
          );
          break;

        default:
          break;
      }

      const client = new OAuth2Client(googleSignInClientId);
      const ticket = await client.verifyIdToken({
        idToken: socialVerifyToken,
      });

      const payload = ticket.getPayload();

      const userInfo: PreparedAuthData = {
        kind: AccountKind.GOOGLE,
        email: payload.email,
        socialUid: payload.sub,
        userInfo: args.prepareUserInfoFn(args.authenticationData),
      };

      // TODO override firstName and lastName with the returned data from google
      // {
      //   ...args.authenticationData.preparedAuthData,
      //   userInfo: {
      //     ...args.authenticationData.preparedAuthData.userInfo,
      //     // override firstName and lastName with the returned data from google
      //     firstName: payload.given_name,
      //     lastName: payload.family_name,
      //   },
      // }

      return userInfo;
    } catch (_) {
      throw new BadRequestException('Invalid signeture');
    }
  }

  async verifyAppleToken(args: {
    authenticationData: AuthenticationData;
    prepareUserInfoFn: (authData: AuthenticationData) => PreparedUserInfo;
  }): Promise<PreparedAuthData> {
    try {
      const { socialVerifyToken } = args.authenticationData.authDto;
      const bundleId = this.configService.get('IOS_BUNDLE_ID');

      if (bundleId == null) {
        throw new BadRequestException('.env variable not set');
      }

      const response = await verifyAppleToken({
        idToken: socialVerifyToken,
        clientId: bundleId,
      });

      const userInfo: PreparedAuthData = {
        kind: AccountKind.APPLE,
        email: response.email,
        socialUid: response.sub,
        userInfo: args.prepareUserInfoFn(args.authenticationData),
      };

      return userInfo;
    } catch (_) {
      throw new BadRequestException('Invalid signeture');
    }
  }
}
