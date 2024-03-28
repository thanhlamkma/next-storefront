import { Form as AntForm } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { KeyboardEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { catchError, map, of } from "rxjs";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Button from "src/components/Button";
import Form from "src/components/Form";
import Input from "src/components/Input";
import Layout from "src/components/layout";
import { useJob } from "src/core/hooks";
import { ChangePasswordRequest } from "src/models/Account";
import AccountRepository from "src/repositories/AccountRepository";
import toast from "src/services/toast";

interface ChangePassWordProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

const ChangePassword: PageComponent = (linkContent: ChangePassWordProps) => {
  const { t } = useTranslation();
  const [form] = AntForm.useForm();
  const { run: runChangePassword } = useJob(
    ({ currentPassword, newPassword }: ChangePasswordRequest) => {
      return AccountRepository.changePassword({
        currentPassword,
        newPassword,
      }).pipe(
        map(({ data, status }: { data: boolean; status: any }) => {
          if (data) {
            toast.show("info", t("myAccount:changePasswordSuccess"));
            form.resetFields();
          }
          return data;
        }),
        catchError((error: Promise<any>) => {
          form.resetFields();
          error.then((err) => {
            const errMessage = err.response?.data?.error?.message;
            const message = t("myAccount:changePasswordFailed");
            toast.show("error", message);
          });
          return of(error);
        })
      );
    }
  );

  const onSubmit = useCallback(() => {
    form.submit();
  }, []);

  const handleSubmit = useCallback((values) => {
    runChangePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  }, []);

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  return (
    <div id="update-email">
      <Head>
        <title>{t("myAccount:changePassword")}</title>
      </Head>
      <div className="mx-auto border rounded-[3px] xs:w-full md:w-[500px] my-6">
        <Form
          form={form}
          onFinish={handleSubmit}
          className="child-form-account p-5"
        >
          <label className="w-[25%] mr-5 font-semibold">
            {t("auth:currentPassword")}
          </label>
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: t("auth:passwordRequired") }]}
          >
            <Input.Password
              className="mt-2 mb-1"
              placeholder={t("auth:enterCurrentPassword")}
            />
          </Form.Item>
          <label className="w-[25%] mr-5 font-semibold">
            {t("auth:newPassword")}
          </label>
          <Form.Item
            name="newPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("newPassword")) {
                    return Promise.reject(
                      new Error(t("myAccount:newPasswordRequired"))
                    );
                  } else if (
                    getFieldValue("currentPassword") ===
                    getFieldValue("newPassword")
                  ) {
                    return Promise.reject(
                      new Error(t("myAccount:currentNotMatchNewPassword"))
                    );
                  }
                  return Promise.resolve();
                },
              }),
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,32}$/,
                message: t("auth:validatePasswordChange"),
              },
            ]}
          >
            <Input.Password
              className="mt-2"
              placeholder={t("auth:enterNewPassword")}
              onKeyDown={handlePreventSpace}
            />
          </Form.Item>
          {/* <div className="child-form-account__description mt-2 mb-4">
            {t("auth:validatePasswordChange")}
          </div> */}
          <label className="w-[25%] mr-5 font-semibold">
            {t("auth:enterNewPasswordAgain")}
          </label>
          <Form.Item
            shouldUpdate
            name="reNewPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("reNewPassword")) {
                    return Promise.reject(
                      new Error(t("myAccount:pleaseEnterPassword"))
                    );
                  } else if (
                    getFieldValue("newPassword") !==
                    getFieldValue("reNewPassword")
                  ) {
                    return Promise.reject(
                      new Error(t("myAccount:reEnterPasswordNotMatchNew"))
                    );
                  }
                  return Promise.resolve();
                },
              }),
              // {
              //   pattern:
              //     /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,32}$/,
              //   message: t("auth:validatePasswordChange"),
              // },
            ]}
          >
            <Input.Password
              className="mt-2"
              placeholder={t("auth:enterNewPasswordAgain")}
              onKeyDown={handlePreventSpace}
            />
          </Form.Item>
          <Button
            className="account__btn px-10 py-2 mt-5 active rounded-[3px] w-[100%]"
            onClick={onSubmit}
          >
            {t("common:saveChange")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

ChangePassword.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default ChangePassword;
