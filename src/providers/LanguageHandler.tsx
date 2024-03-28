import { ReactNode, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Api } from "src/core/api";
import { useMount } from "src/core/hooks";

interface LanguageHandlerProps {
  children: ReactNode;
}

const LanguageHandler = ({ children }: LanguageHandlerProps) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = useCallback(
    (lang: string) => {
      Api.setGlobalHeaders({
        "Accept-Language": lang,
      });
    },
    [i18n]
  );

  useMount(() => {
    Api.setGlobalHeaders({
      "Accept-Language": i18n.language,
    });
  });

  useEffect(() => {
    if (!i18n || !i18n.on) {
      return;
    }

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [handleLanguageChange]);

  return <>{children}</>;
};

export default LanguageHandler;
