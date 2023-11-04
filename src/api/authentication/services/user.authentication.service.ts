import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { GenericAuthenticationService } from './core/generic.authentication.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationData } from 'src/globals/interfaces/global.interface';

@Injectable()
export class UserAuthenticationService extends GenericAuthenticationService<UserDocument> {
  constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {
    super(model);
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
