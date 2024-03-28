import React, { memo, ReactElement } from "react";
import usePermissions from "src/core/permission/usePermissions";

interface PrivateViewProps {
  permissions: string | string[];
  children?: React.ReactNode | ((granted: boolean) => ReactElement);
  guestView?: React.ReactNode;
}

const PrivateView = memo(
  ({ permissions, children, guestView }: PrivateViewProps) => {
    const { granted } = usePermissions(permissions);
    if (typeof children === "function") {
      return children(granted);
    }

    return <>{granted ? children : guestView}</>;
  }
);

export default PrivateView;
