import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountKind } from 'src/globals/enums/global.enum';
import { Document } from 'mongoose';

@Injectable()
export class JwtPrepareService<T extends Document> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async prepareJwtResponse(args: {
    userDocument: T;
    withoutRefreshToken?: boolean;
    payload?: object;
    kind?: AccountKind;
    expiresIn?: string;
  }): Promise<any> {
    // define default jwt payload
    let jwtPaylaod = {
      user: {
        ...args.userDocument.toJSON(), // TODO not save because of password field and other sensitive data
      },
    };

    // if additional payload is given -> add them in jwt
    if (args.payload) {
      jwtPaylaod = {
        user: {
          ...args.userDocument.toJSON(),
        },

        ...args.payload,
      };
    }

    // generate new jwt token
    const authJwtToken = this.jwtService.sign(jwtPaylaod, {
      expiresIn: args.expiresIn ? args.expiresIn : '20m', // when expires in is not given -> default is 20m
    });

    if (args.withoutRefreshToken) {
      return { access_token: authJwtToken, user: args.userDocument };
    }

    // generate new refresh jwt token
    const authJwtRefreshToken = this.jwtService.sign(jwtPaylaod, {
      secret: this.configService.get('JWT_SECRET_KEY_REFRESH_TOKEN'),
    });

    const jwtResponse = {
      access_token: authJwtToken,
      refresh_token: authJwtRefreshToken,
      user: args.userDocument,
    };

    if (args.kind) {
      jwtResponse['kind'] = args.kind;
    }

    return jwtResponse;
  }
}
