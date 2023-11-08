import { BadRequestException } from '@nestjs/common';
import { UserType } from '../enums/global.enum';

export const getResourceUserFieldBasedOnUserType = (args: {
  userType: UserType;
}): string => {
  // returns query for resource based on user type
  if (args.userType === UserType.USER) {
    return 'user';
  } else {
    console.log(
      'Please extend the service (user.role.assign.service.ts) for the user type: ' +
        args.userType,
    );
    throw new BadRequestException('Define user field for user type');
  }
};
