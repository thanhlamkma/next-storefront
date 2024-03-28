import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Api } from "src/core/api";
import TokenManager from "src/core/api/TokenManager";

export function getServerSidePropsWithApi(
  fn: GetServerSideProps,
  tokenType: TokenTypes = "base_token"
): GetServerSideProps {
  return async function (context) {
    const session = await getSession(context);
    if (session?.tokens) {
      TokenManager.setToken(tokenType, session?.tokens[tokenType] || "");
    }

    Api.setGlobalHeaders({
      "Accept-Language": context.locale || "vi",
    });

    return fn(context);
  };
}
