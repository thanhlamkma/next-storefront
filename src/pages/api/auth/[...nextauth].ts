import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { catchError, lastValueFrom, map, of } from "rxjs";
import { authProviders } from "src/auth";
import env from "src/core/env";
import { AuthErrors } from "src/models/Account";
import AccountRepository from "src/repositories/AccountRepository";

// function deleteCookie(req: NextApiRequest, name: string) {
//   req.headers.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// }

function getCookie(req?: NextApiRequest, name?: string) {
  var locale = name + "=";
  var arr = req?.headers.cookie?.split(";");
  if (arr) {
    for (var i = 0; i < arr.length; i++) {
      var c = arr[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(locale) == 0) {
        // deleteCookie(req, name);
        return c.substring(locale.length, c.length);
      }
    }
  }
  return "";
}

export const getNextAuthConfig = (
  req?: NextApiRequest,
  res?: NextApiResponse
): NextAuthOptions => {
  const locale = getCookie(req, "locale");

  return {
    debug: env.NODE_ENV === "development",
    providers: authProviders,
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpiresIn =
            Date.now() + user.accessTokenExpiresIn * 1000;
          token.picture = user.picture;
          token.userId = user.userId;
        }

        if (Date.now() < token.accessTokenExpiresIn) {
          return token;
        }

        return lastValueFrom(
          AccountRepository.credentialsLogin({
            grant_type: "refresh_token",
            client_id: env.CREDENTIALS_CLIENT_ID,
            client_secret: env.CREDENTIALS_CLIENT_SECRET,
            refresh_token: token.refreshToken,
          }).pipe(
            map(({ data }) => {
              return {
                ...token,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                accessTokenExpiresIn: Date.now() + data.expires_in * 1000,
              };
            }),
            catchError((error) => {
              return of({
                ...token,
                error: AuthErrors.RefreshToken,
              });
            })
          )
        );
      },

      async session({ session, token, user }) {
        session.tokens = {
          base_token: token.accessToken,
          refresh_token: token.refreshToken,
        };
        session.expires = new Date(token.accessTokenExpiresIn);
        session.error = token.error;
        session.user.id = token.userId;

        return session;
      },
    },
    pages: {
      signIn: `${locale ? "/" + locale : ""}/auth/login`,
      newUser: "/auth/login?tab=signUp", // New users will be directed here on first sign in (leave the property out if not of interest)
    },
  };
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(getNextAuthConfig(req, res))(req, res);
}
