import React, { useCallback } from "react";

export interface PermissionContextType {
  userPermissions: string[];
  can: (permissions: string | string[]) => boolean;
}

export const PermissionContext = React.createContext<
  PermissionContextType | undefined
>(undefined);

interface PermissionProviderProps {
  userPermissions: string[];
  isUser: boolean;
  children?: React.ReactNode;
}

const PermissionProvider = ({
  userPermissions,
  isUser,
  children,
}: PermissionProviderProps) => {
  const can = useCallback(
    (permissions: string | string[]) => {
      let listPermissions: string[] = [];

      if (!Array.isArray(permissions)) {
        listPermissions = permissions.split(",");
      } else {
        listPermissions = permissions;
      }

      if (!listPermissions.length) {
        return true;
      }

      if (!isUser) {
        return false;
      }

      const granted =
        userPermissions.filter((perm) => listPermissions.includes(perm))
          .length > 0;

      return granted;
    },
    [isUser, userPermissions]
  );

  return (
    <PermissionContext.Provider value={{ userPermissions, can }}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
