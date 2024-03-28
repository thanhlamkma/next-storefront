import { Spin } from "antd";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToggle } from "src/core/hooks/useToggle";

export type LoadingContextType = {
  startLoading: () => void;
  stopLoading: () => void;
  state: boolean;
};

export const LoadingContext = React.createContext<
  LoadingContextType | undefined
>(undefined);

export type LoadingComponentType = React.ComponentType<{
  state: boolean;
  color?: string;
}>;

interface LoadingProviderProps {
  color?: string;
  component?: LoadingComponentType;
  children?: ReactNode;
}

export function LoadingProvider({
  children,
  color,
  component: Component,
}: LoadingProviderProps) {
  const { state, on: turnOnLoading, off: turnOfLoading } = useToggle();
  const setCountLoading = useState(0)[1];

  const startLoading = useCallback(() => {
    turnOnLoading();
    setCountLoading((old) => old + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setCountLoading((old) => {
      if (old <= 1) {
        turnOfLoading();
        return 0;
      }

      return old - 1;
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, state }}>
      {Component ? (
        <Component state={state} color={color} />
      ) : (
        <div id="main-spin-container">
          <Spin spinning={state}>{children}</Spin>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = (state?: boolean) => {
  const context = useContext<LoadingContextType | undefined>(LoadingContext);

  if (context === undefined) {
    throw new Error("useLoading must be used in LoadingProvider");
  }

  useEffect(() => {
    if (typeof state === "undefined") {
      return;
    }

    if (state) {
      context.startLoading();
    } else {
      context.stopLoading();
    }
  }, [state, context]);

  return context;
};
