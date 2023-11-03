export enum LanguageCode {
  DE = 'de',
  EN = 'en',
}

export enum TimeZone {
  AT = 'Europe/Vienna',
}

export enum AccountKind {
  INTERNAL = 'INTERNAL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum RoleAlias {
  APP_USER = 'APP_USER',
  // ...
}

// for the distinction between user and project rights in the user role assign collection
export enum RoleMmbership {
  USER = 'USER',
  STUDIO = 'STUDIO',
}

export enum UserType {
  USER = 'USER',
}

export enum ResourceType {
  DEFAULT = 'DEFAULT',
}

export enum TokenType {
  DEFAULT = 'DEFAULT',
}

export enum PlatformKind {
  ANDROID = 'android',
  IOS = 'ios',
}
