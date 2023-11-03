import AuthenticationDto from 'src/dtos/authentication/authentication.dto';
import { LanguageCode, RoleMmbership } from '../enums/global.enum';
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
  gender?: string;
  profileImageUrl?: string;
  trainingsLevel?: number;
  bodyHeight?: number;
  studios?: any[];
  goals?: any[];

  // req properties add from the auth middleware
  resource: string;
  tokenType: string;
  permissions: ResourcePermission[];
  studioPermissions?: ResourcePermission[];
}

export interface ResourcePermission {
  _id: string;
  validUntil: Date;
  validFrom: Date;
  resource: string;
  resourceType: string;
  roleAlias: string;
  permissions: string[];
  membership: RoleMmbership;
}

export interface PreparedAuthData {
  kind: AccountKind;
  email: string;
  userInfo: {
    firstName?: string;
    lastName?: string;
    deviceIdentifierID?: string;
    password?: string;
    socialUid?: string;
    profileImageUrl?: string;
  };
}

export interface AuthenticationData {
  authDto: AuthenticationDto;
  preparedAuthData?: PreparedAuthData;
  customData?: any;
}
