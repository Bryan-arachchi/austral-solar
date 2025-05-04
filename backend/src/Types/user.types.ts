import { ClsStore } from 'nestjs-cls';
import { User } from 'src/users/entities/user.entity';

export enum userTypes {
  ADMIN = 'Admin',
  CLIENT = 'Client',
}

export enum UserAuthState {
  UNVERIFIED = 'Unverified',
  VERIFIED = 'Verified', //email verified
  SIGNUP_COMPLETE = 'Signup_Complete', //additional information provided
}

export interface AppClsStore extends ClsStore {
  'x-request-id': string;
  user: MinimalUser;
}

export interface MinimalUser {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: userTypes[];
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
}

export interface UserInfo {
  sub: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}

export interface AuthCallbackResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  user_info?: UserInfo;
  user?: User;
  email_verified: boolean;
}
