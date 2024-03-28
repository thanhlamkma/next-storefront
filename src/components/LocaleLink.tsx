import { Alert, Button } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { KeyboardEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input } from "src/components";
import { AuthErrors, CredentialsLoginRequest } from "src/models/Account";
import Link, { LinkProps } from "next/link";

interface LocaleLinkProps extends LinkProps {}

const LocaleLink = (props: LocaleLinkProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  return (
    <Link href={props.href} locale={locale} >
      <a className="text-blue-33 hover:underline">{t("auth:privacyPolicy")}</a>
    </Link>
  );
};

export default LocaleLink;
