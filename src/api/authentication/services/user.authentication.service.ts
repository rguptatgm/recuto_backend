import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { GenericAuthenticationService } from './core/generic.authentication.service';
import { JwtPrepareService } from './core/generic.jwt.prepare.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationData } from 'src/globals/interfaces/global.interface';
import { SocialAuthenticationHelperService } from './core/social.authentication.helper.service';

@Injectable()
export class UserAuthenticationService extends GenericAuthenticationService<UserDocument> {
  constructor(
    protected readonly jwtPrepareService: JwtPrepareService<UserDocument>,
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    protected readonly socialAuthHelperService: SocialAuthenticationHelperService,
  ) {
    super(jwtPrepareService, model, socialAuthHelperService);
  }

  async findUserByIdentifier(
    authenticationData: AuthenticationData,
  ): Promise<UserDocument> {
    const { email } = authenticationData.authDto;

    const res = await this.findOne({
      conditions: {
        email: email,
      },
    });

    return res as any;
  }
}
