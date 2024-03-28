import { message } from "antd";
import { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Api } from "src/core/api";
import { useMount } from "src/core/hooks";

interface ApiProviderProps {
  children: ReactElement;
  error?: boolean | string;
}

const ErrorHandler = ({ children, error }: ApiProviderProps) => {
  const { t } = useTranslation();

  useMount(() => {
    const removeIntercepter = Api.addInterceptor({
      response: {
        error(error) {
          const { response } = error;
          if (response && response.data.error && response.data.error.message) {
            message.destroy();
            message.error(response.data.error.message);
          }

          return error;
        },
      },
    });

    return removeIntercepter;
  });

  useEffect(() => {
    if (error) {
      message.error(typeof error === "boolean" ? t("common:errorApi") : error);
    }
  }, [error]);

  return children;
};

export default ErrorHandler;
