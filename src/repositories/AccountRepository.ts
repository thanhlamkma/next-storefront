import { Repository } from "src/core/Repository";
import {
  ChangePasswordOtpRequest,
  ChangePasswordRequest,
  CredentialsLoginRequest,
  CredentialsLoginResponse,
  GetTokenSocialResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  SendOtpRequest,
} from "src/models/Account";

class AccountRepository extends Repository {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_AUTH_URL);
  }

  credentialsLogin(data: CredentialsLoginRequest) {
    return this.api.post<CredentialsLoginResponse>("/connect/token", data, {
      contentType: "urlEncoded",
    });
  }

  changePassword({ currentPassword, newPassword }: ChangePasswordRequest) {
    return this.request({
      method: "post",
      url: "/api/user/change-password",
      data: {
        currentPassword,
        newPassword,
      },
    });
  }

  register(data: RegisterUserRequest) {
    return this.api.post<RegisterUserResponse>("/api/user/register", data);
  }

  sendEmailOTP(data: SendOtpRequest) {
    return this.request({
      method: "POST",
      url: "/api/user/otp-forgot-password",
      data,
    });
  }

  changePasswordOTP(data: ChangePasswordOtpRequest) {
    return this.request({
      method: "POST",
      url: "/api/user/forgot-password",
      data,
    });
  }

  getTokenFacebook(accessToken: string) {
    return this.request<GetTokenSocialResponse>({
      method: "POST",
      url: "/api/facebook/get-token",
      data: {
        accessToken: accessToken,
      },
    });
  }

  signInByFacebook(facebookId: string) {
    return this.request({
      method: "POST",
      url: "/api/facebook/account-link",
      data: {
        facebookId: facebookId,
      },
    });
  }

  getTokenGoogle(accessToken: string) {
    return this.request<GetTokenSocialResponse>({
      method: "POST",
      url: "/api/google/get-token",
      data: {
        accessToken: accessToken,
      },
    });
  }

  signInByGoogle(accessToken: string) {
    return this.request({
      method: "POST",
      url: "/api/google/account-link",
      data: {
        accessToken: accessToken,
      },
    });
  }
}

export default new AccountRepository();
