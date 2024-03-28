import Credentials from "next-auth/providers/credentials";
import { lastValueFrom } from "rxjs";
import TokenManager from "src/core/api/TokenManager";
import AccountRepository from "src/repositories/AccountRepository";
import InfoUserRepository from "src/repositories/InfoUserRepository";

export default Credentials({
  id: "facebook-login",
  credentials: {
    accessToken: {},
  },

  async authorize(credentials) {
    if (!credentials) {
      return null;
    }

    try {
      const res = await lastValueFrom(
        AccountRepository.getTokenFacebook(credentials.accessToken)
      );

      TokenManager.setToken("base_token", res.data.accessToken);
      const { data: user } = await lastValueFrom(
        InfoUserRepository.getBaseProfile()
      );

      return {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        accessTokenExpiresIn: res.data.expiresIn,
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
