import { ReactNode, useEffect } from "react";
import { Api } from "src/core/api";
import { useLoading } from "src/core/loading";
import { ApiRequestConfig } from "src/core/models/api";
type ApiLoadingHandlersProps = {
  children?: ReactNode;
};

export default ({ children }: ApiLoadingHandlersProps) => {
  const { startLoading, stopLoading } = useLoading();
  useEffect(() => {
    const interceptors = Api.addInterceptor({
      request: (config) => {
        if (config.showLoading) {
          startLoading();
        }
        return config;
      },
      response: {
        success: (res) => {
          if ((res.config as ApiRequestConfig).showLoading) {
            stopLoading();
          }
          return res;
        },
        error: (err) => {
          if (err.request) {
            if (err.config.showLoading) {
              stopLoading();
            }
          }

          return err;
        },
      },
    });
    return () => interceptors();
  }, []);

  return <>{children}</>;
};
