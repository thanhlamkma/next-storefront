import { Button, Checkbox, Form as AntForm } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { KeyboardEventHandler, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { catchError, map, of } from "rxjs";
import { Form, Input } from "src/components";
import SocialsAuth from "src/components/auth/SocialsAuth";
import { useJob } from "src/core/hooks";
import { useLoading } from "src/core/loading";
import { RegisterUserRequest } from "src/models/Account";
import AccountRepository from "src/repositories/AccountRepository";

type TypeUser = "customer" | "vendor";
interface SignUpProps {
  setTab?: React.Dispatch<React.SetStateAction<"signIn" | "signUp">>;
  setSignUpSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CustomFormProps {}

export const CustomForm = (props: CustomFormProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      {t("auth:policyContent")}{" "}
      <Link href="#">
        <a className="text-blue-33 hover:underline">
          {t("auth:privacyPolicy")}
        </a>
      </Link>
    </div>
  );
};

interface VendorFormProps {}

// export const VendorForm = (props: VendorFormProps) => {
//   const { t } = useTranslation();
//   return (
//     <div id="vendor-form">
//       <Form.Item
//         name="firstName"
//         label={t("auth:labelFirstName")}
//         rules={[{ required: true, message: t("auth:firstNameRequired") }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="lastName"
//         label={t("auth:labelLastName")}
//         rules={[{ required: true, message: t("auth:lastNameRequired") }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="shopName"
//         label={t("auth:labelShopName")}
//         rules={[{ required: true, message: t("auth:shopNameRequired") }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="shopURL"
//         label={t("auth:labelShopUrl")}
//         rules={[
//           {
//             required: true,
//             message: t("auth:shopUrlRequired"),
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="phoneNumber"
//         label={t("auth:labelPhoneNumber")}
//         rules={[
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               const numberPhone = parseInt(getFieldValue("phoneNumber"));
//               const regexNumber = /^\d+$/;
//               if (getFieldValue("phoneNumber") === "") {
//                 return Promise.reject(new Error(t("auth:phoneNumberRequired")));
//               } else if (!regexNumber.test(getFieldValue("phoneNumber"))) {
//                 return Promise.reject(new Error(t("auth:checkPhoneNumber")));
//               } else if (numberPhone.toString().length !== 9) {
//                 return Promise.reject(new Error(t("auth:phoneNumberHasTen")));
//               }
//               return Promise.resolve();
//             },
//           }),
//         ]}
//       >
//         <Input />
//       </Form.Item>
//     </div>
//   );
// };

const SignUp = ({ setTab, setSignUpSuccess }: SignUpProps) => {
  const [form] = AntForm.useForm();
  const { t } = useTranslation();
  const router = useRouter();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoading();

  const handlePreventSpace: KeyboardEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    }, []);

  const { run: register } = useJob((data: RegisterUserRequest) => {
    startLoading();
    return AccountRepository.register(data).pipe(
      map(() => {
        stopLoading();
        setDisableBtn(true);
        setTab && setTab("signIn");
        setSignUpSuccess && setSignUpSuccess(true);
      }),
      catchError((err) => {
        stopLoading();
        console.log("err register", err);
        return of(err);
      })
    );
  });

  return (
    <div id="sign-up">
      <Head>
        <title>{t("auth:signUp")}</title>
      </Head>
      <Form
        layout="vertical"
        enableReinitialize
        labelWrap
        form={form}
        onFinish={register}
        initialValues={{}}
      >
        <Form.Item
          name="userName"
          label={t("auth:labelUsername")}
          rules={[
            { required: true, message: t("auth:userNameRequired") },
            {
              min: 6,
              message: t("auth:errors.invalidUsernameLength"),
            },
            {
              pattern: /^[a-zA-Z0-9@.]+$/,
              message: t("auth:errors.invalidUserName"),
            },
          ]}
        >
          <Input name="username" onKeyDown={handlePreventSpace} />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("auth:labelPassword")}
          rules={[
            { required: true, message: t("auth:passwordRequired") },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,32}$/,
              message: t("auth:validatePasswordChange"),
            },
            // {
            //   pattern:
            //     /^(?=.*[a-z])(?=.*[0-9])(?!.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).{8,32}$/, // Regex có chứa ít nhất 1 chữ thường, số và không chứa ký tự có dấu và không chứa ký tự đặc biệt
            //   message: t("auth:errors.invalidPasswordLength"),
            // },
          ]}
        >
          <Input.Password name="password" onKeyDown={handlePreventSpace} />
        </Form.Item>
        <CustomForm />
        <Form.Item
          name="agreePolicy"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("")),
            },
          ]}
        >
          <Checkbox>
            {t("auth:iGreeTo")}{" "}
            <Link href="#">
              <a className="text-blue-33 hover:underline">
                {t("auth:privacyPolicy")}
              </a>
            </Link>
          </Checkbox>
        </Form.Item>
        <Form.Item className="mb-[0]">
          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            disabled={disableBtn}
          >
            {t("auth:signUp")}
          </Button>
        </Form.Item>
        {/* SocialLink */}
        <SocialsAuth />
      </Form>
    </div>
  );
};

export default SignUp;
