import { Button, Form } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { catchError, map, of } from "rxjs";
import { Input } from "src/components";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { ChangePasswordOtpRequest } from "src/models/Account";
import AccountRepository from "src/repositories/AccountRepository";
import toast from "src/services/toast";

type Props = {};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

const ChangePassword: PageComponent<Props> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Call API
  const { run: changePasswordOtpAPi } = useJob(
    (data: ChangePasswordOtpRequest) => {
      return AccountRepository.changePasswordOTP(data).pipe(
        map((data) => {
          console.log("data", data);
          toast.show("success", t("myAccount:changePasswordSuccess"));
          router.push({
            pathname: "/auth/login",
          });
        }),
        catchError((err) => {
          console.log("err", err);
          toast.show("error", t("myAccount:changePasswordFailed"));
          return of(err);
        })
      );
    }
  );

  const handleSubmit = useCallback((values: any) => {
    changePasswordOtpAPi(values);
  }, []);

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  return (
    <>
      <Head>
        <title>{t("myAccount:changePassword")}</title>
      </Head>
      <div id="forgot-password">
        <div className="container">
          <div id="send-otp" className="max-w-[500px]">
            <Form
              layout="vertical"
              action="/api/auth/callback/password-login"
              onFinish={handleSubmit}
              method="POST"
            >
              <Form.Item
                name="email"
                label={t("auth:labelEmail")}
                rules={[
                  { required: true, message: t("auth:emailRequired") },
                  {
                    type: "email",
                    pattern: /^[a-zA-Z0-9@.]+$/,
                    message: t("auth:userNameTypeEmail"),
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                name="otp"
                label={t("auth:labelOTP")}
                rules={[{ required: true, message: t("auth:OTPrequired") }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label={t("auth:labelPassword")}
                rules={[
                  {
                    required: true,
                    message: t("auth:passwordRequired"),
                  },
                ]}
              >
                <Input.Password onKeyDown={handlePreventSpace} />
              </Form.Item>
              <Form.Item className="mb-[0]">
                <Button
                  className="w-full"
                  type="primary"
                  htmlType="submit"
                  style={{ height: "40px", fontSize: "16px" }}
                >
                  {t("myAccount:changePassword")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

ChangePassword.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default ChangePassword;
