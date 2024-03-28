import jwtDecode from "jwt-decode";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineGoogle } from "react-icons/ai";
import { useDidUpdate, useMount } from "src/core/hooks";
import { makeId } from "src/core/utilities";

declare global {
  var google: any;

  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}
var google: any;
var appendedGoogleScript = false;

export interface GoogleCredentialResponse {
  iss: string; // The JWT's issuer
  nbf: number;
  aud: string; // Your server's client ID
  sub: string; // The unique ID of the user's Google Account
  hd: string; // If present, the host domain of the user's GSuite email address
  email: string; // The user's email address
  email_verified: true; // true, if Google has verified the email address
  azp: string;
  name: string;
  // If present, a URL to user's profile picture
  picture: string;
  given_name: string;
  family_name: string;
  iat: number; // Unix timestamp of the assertion's creation time
  exp: number; // Unix timestamp of the assertion's expiration time
  jti: string;
  token: string;
}

interface GoogleSignInButtonProps {
  clientId: string;
  onSuccess?: (response: GoogleCredentialResponse) => void;
}

export default function GoogleSignInButton({
  clientId,
  onSuccess,
}: GoogleSignInButtonProps) {
  // Handle load google script
  const [loadedScript, setLoadedScript] = useState(appendedGoogleScript);
  const [initialized, setInitialized] = useState(false);
  const buttonId = useRef(makeId(5)).current;
  const { i18n } = useTranslation();

  const handleLoginSuccess = useCallback(
    (response: any) => {
      onSuccess &&
        onSuccess({
          ...jwtDecode(response.credential),
          token: response.credential,
        });
    },
    [onSuccess]
  );

  const initializeGoogleScript = () => {
    if (initialized) {
      return;
    }

    if (!window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleLoginSuccess,
    });

    window.google.accounts.id.renderButton(
      document.getElementById(buttonId),
      {
        size: "large",
        shape: "circle",
        locale: i18n.language === "vi" ? "vi_VN" : "en_EN",
      } // customization attributes
    );

    window.google.accounts.id.prompt();

    setInitialized(true);
  };

  useMount(() => {
    if (appendedGoogleScript) {
      initializeGoogleScript();
      return;
    }

    const jsScript = document.createElement("script");
    jsScript.src = "https://accounts.google.com/gsi/client";
    jsScript.async = true;
    jsScript.defer = true;

    jsScript.onload = () => {
      setLoadedScript(true);
      initializeGoogleScript();
    };

    document.head.appendChild(jsScript);
    appendedGoogleScript = true;
  });

  useDidUpdate(() => {
    setInitialized(false);
    initializeGoogleScript();
  }, [clientId, onSuccess]);

  const signInGoogle = useCallback(() => {
    if (!loadedScript) {
      return;
    }

    if (!google) {
      return;
    }

    google.accounts.id.prompt();
  }, [loadedScript]);

  return (
    <>
      <Head>
        <script src="https://accounts.google.com/gsi/client"></script>
      </Head>
      <div id={buttonId} className="social-google" onClick={signInGoogle}>
        <AiOutlineGoogle />
      </div>
    </>
  );
}
