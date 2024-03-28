import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useLoading } from "src/core/loading";

interface RouteLoadingHandlerProps {
  children?: ReactNode;
}

const RouteLoadingHandler = ({ children }: RouteLoadingHandlerProps) => {
  const { stopLoading } = useLoading();
  const { events } = useRouter();

  useEffect(() => {
    const stopLoadingOnRouteChange = () => {
      stopLoading();
    };

    events.on("routeChangeComplete", stopLoadingOnRouteChange);

    return () => {
      events.off("routeChangeComplete", stopLoadingOnRouteChange);
    };
  }, [events]);

  return <>{children}</>;
};

export default RouteLoadingHandler;
