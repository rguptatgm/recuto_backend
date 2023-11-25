import AuthenticationDto from 'src/dtos/authentication/authentication.dto';
import { LanguageCode, RoleMmbership, UserType } from '../enums/global.enum';
import { AccountKind } from '../enums/global.enum';

export interface RequestUser {
  // user properties added by the auth middleware
  _id: string;
  setupCompleted?: boolean;
  deviceIdentifierID: string;
  email: string;
  language: LanguageCode;
  lastName?: string;
  firstName?: string;
  dateOfBirth?: Date;
  profileImageUrl?: string;

  // req properties add from the auth middleware
  resource: string;
  tokenType: string;
  permissions: ResourcePermission[];
  projectPermissions?: ResourcePermission[];
}

export interface ResourcePermission {
  _id: string;
  validUntil: Date;
  validFrom: Date;
  resource: string;
  resourceType: UserType;
  roleAlias: string;
  permissions: string[];
  membership: RoleMmbership;
}

export interface PreparedUserInfo {
  firstName?: string;
  lastName?: string;
  deviceIdentifierID?: string;
  profileImageUrl?: string;
}

export interface PreparedAuthData {
  kind: AccountKind;
  email: string;
  password?: string;
  socialUid?: string;
  userInfo: PreparedUserInfo;
}

export interface AuthenticationData {
  authDto: AuthenticationDto;
  preparedAuthData?: PreparedAuthData;
  customData?: any;
}
