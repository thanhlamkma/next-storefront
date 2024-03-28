import { message } from "antd";
import { ReactNode, useCallback, useState } from "react";

export function useProgressMessage() {
  const [key] = useState(Math.random() * 9999);

  const startProgress = useCallback((text: ReactNode) => {
    message.loading({
      content: text,
      key,
      duration: 0,
    });
  }, []);

  const progressSuccess = useCallback((text: ReactNode) => {
    message.success({
      content: text,
      key,
    });
  }, []);

  const progressFail = useCallback((text: ReactNode) => {
    message.error({
      content: text,
      key,
    });
  }, []);

  const destroyProgress = useCallback(() => {
    message.destroy(key);
  }, []);

  return {
    startProgress,
    progressSuccess,
    progressFail,
    destroyProgress,
  };
}
