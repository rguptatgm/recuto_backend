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
    const { userDocument: user } = args;

    // define default jwt payload
    let jwtPaylaod = {
      _id: user._id,
      // email: user.email, // TODO
    };

    // if additional payload is given -> add them in jwt
    if (args.payload) {
      jwtPaylaod = {
        _id: user._id,
        // email: user.email, // TODO

        ...args.payload,
      };
    }

    // generate new jwt token
    const authJwtToken = this.jwtService.sign(jwtPaylaod, {
      expiresIn: args.expiresIn ? args.expiresIn : '20m', // when expires in is not given -> default is 20m
    });

    if (args.withoutRefreshToken) {
      return { access_token: authJwtToken, user: user };
    }

    // generate new refresh jwt token
    const authJwtRefreshToken = this.jwtService.sign(jwtPaylaod, {
      secret: this.configService.get('JWT_SECRET_KEY_REFRESH_TOKEN'),
    });

    const jwtResponse = {
      access_token: authJwtToken,
      refresh_token: authJwtRefreshToken,
      user: user,
    };

    if (args.kind) {
      jwtResponse['kind'] = args.kind;
    }

    return jwtResponse;
  }
}
