import { message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import ReactFacebookLogin, {
  ReactFacebookLoginInfo,
} from "react-facebook-login";
import { useTranslation } from "react-i18next";
import { TiSocialFacebook } from "react-icons/ti";
import GoogleSignInButton, {
  GoogleCredentialResponse,
} from "src/components/auth/GoogleSignInButton";
import { useLoading } from "src/core/loading";

interface SocialsAuthProps {}

const SocialsAuth = (props: SocialsAuthProps) => {
  const { t } = useTranslation();
  const { query, locale, push, events } = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleLoginFacebook = useCallback(
    (response: ReactFacebookLoginInfo) => {
      if (!response.accessToken) {
        return;
      }

      startLoading();
      signIn("facebook-login", {
        accessToken: response.accessToken,
        redirect: false,
      })
        .then((res) => {
          if (res?.ok) {
            push(
              query.callbackUrl && !query.callbackUrl.includes("auth/login")
                ? (query.callbackUrl as string) || ""
                : `/${locale}`
            );
            return;
          }

          stopLoading();
          message.error(
            t("auth:errors.socialSignInFailed", { social: "Facebook" })
          );
        })
        .catch(() => {
          stopLoading();
          message.error(
            t("auth:errors.socialSignInFailed", { social: "Facebook" })
          );
        });
    },
    [query, locale]
  );

  const responseGoogle = (response: GoogleCredentialResponse) => {
    if (!response.token) {
      return;
    }

    startLoading();
    signIn("google-login", {
      accessToken: response.token,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok) {
          push(
            query.callbackUrl && !query.callbackUrl.includes("auth/login")
              ? (query.callbackUrl as string) || ""
              : `/${locale}`
          );

          return;
        }

        stopLoading();
        message.error(
          t("auth:errors.socialSignInFailed", { social: "Facebook" })
        );
      })
      .catch(() => {
        stopLoading();
        message.error(
          t("auth:errors.socialSignInFailed", { social: "Facebook" })
        );
      });
  };

  return (
    <div className="social-link-wrap flex flex-col gap-3 items-center justify-center py-[26px]">
      <ReactFacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}
        autoLoad={false}
        version="14.0"
        fields="name,email,picture"
        callback={handleLoginFacebook}
        cssClass="flex items-center rounded-3xl bg-[#1b4f9b] text-white py-3 px-5 hover:bg-[#123760]"
        icon={<TiSocialFacebook className="text-xl" />}
        textButton={t("auth:signInWithFacebook")}
      />
      <GoogleSignInButton
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        onSuccess={responseGoogle}
      />
    </div>
  );
};

export default SocialsAuth;
