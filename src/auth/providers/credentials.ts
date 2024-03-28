import Credentials from "next-auth/providers/credentials";
import { lastValueFrom } from "rxjs";
import TokenManager from "src/core/api/TokenManager";
import env from "src/core/env";
import AccountRepository from "src/repositories/AccountRepository";
import InfoUserRepository from "src/repositories/InfoUserRepository";

export default Credentials({
  id: "password-login",
  credentials: {
    username: {},
    password: {},
  },

  async authorize(credentials) {
    if (!credentials) {
      return null;
    }

    try {
      const res = await lastValueFrom(
        AccountRepository.credentialsLogin({
          ...credentials,
          grant_type: env.CREDENTIALS_GRANT_TYPE,
          client_id: env.CREDENTIALS_CLIENT_ID,
          client_secret: env.CREDENTIALS_CLIENT_SECRET,
          scope: env.CREDENTIALS_SCOPE,
        })
      );

      TokenManager.setToken("base_token", res.data.access_token);
      const { data: user } = await lastValueFrom(
        InfoUserRepository.getBaseProfile()
      );

      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
        accessTokenExpiresIn: res.data.expires_in,
        name: user.name || user.nickName,
        picture: user.avatar,
        userId: user.userId,
      };
    } catch (error) {
      console.log(((await error) as any)?.response);
      return null;
    }
  },
});
