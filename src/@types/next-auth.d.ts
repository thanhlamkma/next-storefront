import "next-auth";
import { AuthErrors } from "src/models/Account";

declare module "next-auth" {
  interface DefaultUser {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    picture: string;
    userId: number;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    tokens: Partial<Record<TokenTypes, string>>;
    user: {
      /** The user's postal address. */
      name: string;
      email: string;
      image: string;
      id: number;
    };
    expires: Date;
    error?: AuthErrors;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    error?: AuthErrors;
    userId: number;
  }
}
