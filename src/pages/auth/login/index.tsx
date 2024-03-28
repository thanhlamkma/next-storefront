import classnames from "classnames";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "src/components/layout";
import { useDidUpdate, useMount } from "src/core/hooks";
import toast from "src/services/toast";

const SignIn = dynamic(() => import("src/components/auth/SignIn"), {
  ssr: false,
});
const SignUp = dynamic(() => import("src/components/auth/SignUp"), {
  ssr: false,
});

interface LoginProps {
  csrfToken: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        statusCode: 302,
        destination: context.req.headers.referer || `/${locale}`,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

type Tab = "signIn" | "signUp";

const Login: PageComponent<LoginProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>((router.query.tab as Tab) || "signIn");

  useMount(() => {
    setTab((router.query.tab as Tab) || "signIn");
  });
  useDidUpdate(() => {
    router.push(
      {
        pathname: "/auth/login",
        query: {
          tab: tab,
        },
      },
      undefined,
      {
        locale: router.locale,
      }
    );
  }, [tab]);

  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  useEffect(() => {
    console.log("Sign up success", signUpSuccess);

    if (signUpSuccess) {
      toast.show("info", t("auth:signUpSuccess"));
      setSignUpSuccess(false);
    }
  }, [signUpSuccess]);

  return (
    <div id="login">
      <div className="container">
        <div className="login-poup max-w-[500px]">
          {/* tabs */}
          <ul className="tabs flex justify-center flex-wrap uppercase text-black-33 mb-0">
            <li
              onClick={() => setTab("signIn")}
              className={classnames([
                "item-tab py-3 text-black-33 hover:text-blue-33 text-base font-bold cursor-pointer uppercase",
                { active: tab === "signIn" },
              ])}
            >
              {t("auth:signIn")}
            </li>
            <li
              onClick={() => setTab("signUp")}
              className={classnames([
                "item-tab py-3 text-black-33 hover:text-blue-33 text-base font-bold cursor-pointer uppercase",
                { active: tab === "signUp" },
              ])}
            >
              {t("auth:signUp")}
            </li>
          </ul>
          {/* content */}
          <div className="cotent-form pt-[33px] pb-[26px]">
            {tab === "signIn" && <SignIn />}
            {tab === "signUp" && (
              <SignUp setTab={setTab} setSignUpSuccess={setSignUpSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Login.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Login;
