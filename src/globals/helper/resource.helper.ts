import { UserType } from '../enums/global.enum';

export const getResourceUserFieldBasedOnUserType = (args: {
  userType: UserType;
}): string => {
  // returns query for resource based on user type
  if (args.userType === UserType.USER) {
    return 'user';
  }
};
