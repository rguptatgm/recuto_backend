import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { GenericAuthenticationService } from './generic.authentication.service';
import { JwtPrepareService } from './jwt.prepare.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GenericAuthenticationHelperService } from './generic.authentication.helper.service';
import { AuthenticationData } from 'src/globals/interfaces/global.interface';

@Injectable()
export class UserAuthenticationService extends GenericAuthenticationService<UserDocument> {
  constructor(
    protected readonly jwtPrepareService: JwtPrepareService,
    @InjectModel(User.name) readonly model: Model<UserDocument>,
    protected readonly authenticationHelperService: GenericAuthenticationHelperService<UserDocument>,
  ) {
    super(jwtPrepareService, model, authenticationHelperService);
  }

  async findUserByIdentifier(
    authenticationData: AuthenticationData,
  ): Promise<UserDocument> {
    const { email } = authenticationData.authDto;

    return await this.crudService.findOne({
      conditions: {
        email: email,
      },
    });
  }
}
