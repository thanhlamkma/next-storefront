import { signOut, useSession } from "next-auth/react";
import { ReactElement, ReactNode, useEffect } from "react";
import TokenManager from "src/core/api/TokenManager";

interface AuthProviderProps {
  children: ReactElement | ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Handle log user out on expires
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      return;
    }

    if (session.data?.error) {
      signOut({ callbackUrl: "/" });
    }

    if (session.data.tokens) {
      for (const tokenType in session.data.tokens) {
        if (
          Object.prototype.hasOwnProperty.call(session.data.tokens, tokenType)
        ) {
          const token = session.data.tokens[tokenType as TokenTypes];
          if (!token) {
            continue;
          }

          TokenManager.setToken(tokenType as TokenTypes, token);
        }
      }
    }
  }, [session]);

  return <>{children}</>;
};

export default AuthProvider;
