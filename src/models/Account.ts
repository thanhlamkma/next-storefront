export interface CredentialsLoginRequest {
  client_id: string;
  client_secret: string;
  grant_type: string;
  scope?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
}

export interface CredentialsLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export enum AuthErrors {
  RefreshToken = "RefreshTokenError",
  CredentialsSignin = "CredentialsSignin",
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterUserRequest {
  userName: string;
  password: string;
}

export interface RegisterUserResponse {
  id: number;
  active: boolean;
  login: string;
  companyId: number;
  partnerId: number;
}

export type GetTokenSocialResponse = {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginFacebookResponse = {
  authResponse: {
    accessToken: string;
    data_access_expiration_time: number;
    expiresIn: number;
    graphDomain: string;
    signedRequest: string;
    userID: string;
  };
  status: string;
};

export type SendOtpRequest = {
  email: string;
};

export type ChangePasswordOtpRequest = {
  email: string;
  otp: string;
  password: string;
};
