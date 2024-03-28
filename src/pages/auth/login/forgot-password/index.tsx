import { Button, Form } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { catchError, map, of } from "rxjs";
import { Input } from "src/components";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { SendOtpRequest } from "src/models/Account";
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

const ForgotPassword: PageComponent<Props> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Call API
  const { run: sendOTPApi } = useJob((data: SendOtpRequest) => {
    return AccountRepository.sendEmailOTP(data).pipe(
      map((data) => {
        console.log("data", data);
        toast.show("success", t("auth:sendOTPSuccess"));
        router.push({
          pathname: "/auth/login/change-password",
        });
      }),
      catchError((err) => {
        console.log("err", err);
        toast.show("error", t("auth:sendOTPFail"));
        return of(err);
      })
    );
  });

  const handleSubmit = useCallback((value: any) => {
    sendOTPApi(value);
  }, []);

  return (
    <>
      <Head>
        <title>{t("auth:sendOTP")}</title>
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
                label={t("auth:enterEmailOTP")}
                rules={[
                  { required: true, message: t("auth:emailRequired") },
                  {
                    type: "email",
                    pattern: /^[a-zA-Z0-9@.]+$/,
                    message: t("auth:userNameTypeEmail"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item className="mt-2">
                <Button
                  className="w-full"
                  type="primary"
                  htmlType="submit"
                  style={{ height: "40px", fontSize: "16px" }}
                >
                  {t("auth:sendOTP")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

ForgotPassword.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default ForgotPassword;
