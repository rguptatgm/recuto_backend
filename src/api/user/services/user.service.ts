import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user/user.schema';
import { GenericCrudService } from 'src/globals/services/generic.crud.service';

@Injectable()
export class UserService extends GenericCrudService<UserDocument> {
  constructor(@InjectModel(User.name) readonly user: Model<UserDocument>) {
    super(user);
  }

  async addFcmToken(args: {
    user: UserDocument;
    fcmToken: string;
  }): Promise<UserDocument> {
    const { user, fcmToken } = args;

    // Check if fcm token already exists
    const fcmTokenExists = user.fcmTokens.includes(fcmToken);
    if (fcmTokenExists) {
      return args.user;
    }

    // add fcm token
    const updatedUser = await this.updateOne({
      conditions: { _id: user._id },
      changes: { $push: { fcmTokens: fcmToken } },
    });

    return updatedUser;
  }

  async removeFcmToken(args: {
    user: UserDocument;
    fcmToken: string;
  }): Promise<UserDocument> {
    const { user, fcmToken } = args;

    // Check if fcm token already exists
    const fcmTokenExists = user.fcmTokens.includes(fcmToken);
    if (!fcmTokenExists) {
      return args.user;
    }

    // remove fcm token
    const updatedUser = await this.updateOne({
      conditions: { _id: user._id },
      changes: { $pull: { fcmTokens: fcmToken } },
    });

    return updatedUser;
  }
}
