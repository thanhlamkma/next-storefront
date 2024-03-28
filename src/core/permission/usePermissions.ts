import { useContext, useMemo } from "react";
import { PermissionContext } from "src/core/permission/PermissionProvider";

const usePermissions = (permissions?: string | string[]) => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error("usePermissions must be used in PermissionProvider");
  }

  const granted = useMemo(() => {
    if (!permissions) {
      return true;
    }

    return context.can(permissions);
  }, [permissions, context.can]);

  return {
    granted,
    ...context,
  };
};

export default usePermissions;
