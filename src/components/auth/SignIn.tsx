import { Alert, Button } from "antd";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input } from "src/components";
import SocialsAuth from "src/components/auth/SocialsAuth";
import { useLoading } from "src/core/loading";
import { CredentialsLoginRequest } from "src/models/Account";

interface SignInProps {}

const SignIn = (props: SignInProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query, push } = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [credentialsSignInError, setCredentialsSignInError] = useState(false);

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  const handleSubmit = useCallback(
    (values: CredentialsLoginRequest) => {
      document.cookie = `locale=${router.locale}`;

      startLoading();
      signIn("password-login", {
        username: values.username,
        password: values.password,
        redirect: false,
      })
        .then((response) => {
          if (response?.ok) {
            push(
              query.callbackUrl && !query.callbackUrl.includes("auth/login")
                ? (query.callbackUrl as string) || ""
                : `/${router.locale}`
            );
            return;
          }
          stopLoading();
          setCredentialsSignInError(true);
        })
        .catch(() => {
          stopLoading();
          setCredentialsSignInError(true);
        });
    },
    [router.locale, query.callbackUrl]
  );

  return (
    <div id="sign-in">
      <Head>
        <title>{t("auth:signIn")}</title>
      </Head>
      <Form
        layout="vertical"
        action="/api/auth/callback/password-login"
        onFinish={handleSubmit}
        method="POST"
      >
        {credentialsSignInError && (
          <Alert
            type="error"
            message={t("auth:errors.invalidUserNameOrPassword")}
            className="mb-3"
          />
        )}
        <Form.Item
          name="username"
          label={t("auth:labelUsername")}
          rules={[
            {
              required: true,
              message: t("auth:userNameRequired"),
            },
            // {
            //   min: 6,
            //   message: t("auth:errors.incorrectUserNameOrPassword"),
            // },
            // {
            //   pattern: /^[a-zA-Z0-9@.]+$/,
            //   message: t("auth:errors.invalidUserNameOrPassword"),
            // },
          ]}
        >
          <Input name="username" onKeyDown={handlePreventSpace} />
        </Form.Item>
        <Form.Item
          className="mb-3"
          name="password"
          label={t("auth:labelPassword")}
          rules={[
            {
              required: true,
              message: t("auth:passwordRequired"),
            },
            // {
            //   pattern:
            //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(^[a-zA-Z0-9]).{8,32}$/, // Regex có ít nhất 1 chữ in hoa, chữ thường và số
            //   message: t("auth:errors.invalidUserNameOrPassword"),
            // },
          ]}
        >
          <Input.Password name="password" onKeyDown={handlePreventSpace} />
        </Form.Item>
        {/* <p
          className="mb-4 text-xs text-right cursor-pointer hover:text-[#336699]"
          onClick={() => {
            router.push({
              pathname: `/${router.locale}/auth/forgot-password`,
            });
          }}
        >
          {t("auth:forgotPassword")}
        </p> */}
        <div className="mb-4 text-xs text-right">
          <Link
            href={{
              pathname: "/auth/login/forgot-password",
            }}
          >
            {t("auth:forgotPassword")}
          </Link>
        </div>
        {/* <div className="flex justify-between">
          <Form.Item name="remember" valuePropName="rememberMe">
            <Checkbox>{t("auth:rememberMe")}</Checkbox>
          </Form.Item>
          <div>
            <span className="cursor-pointer text-xs text-red-a9">
              {t("auth:lastYourPassword")}
            </span>
          </div>
        </div> */}
        <Form.Item className="mb-[0]">
          <Button className="w-full" type="primary" htmlType="submit">
            {t("auth:signIn")}
          </Button>
        </Form.Item>
        <SocialsAuth />
      </Form>
    </div>
  );
};

export default SignIn;
