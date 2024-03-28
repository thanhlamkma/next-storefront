import { ComponentProps, ComponentType } from "react";
import { PermissionContext } from "src/core/permission/PermissionProvider";

export default function withPermissions<C extends ComponentType<any>>(
  permissions: string | string[]
): (component: C) => C {
  return (Component: C) => {
    return ((props: ComponentProps<C>) => {
      return (
        <PermissionContext.Consumer>
          {(context) => (
            <>{context?.can(permissions || []) && <Component {...props} />}</>
          )}
        </PermissionContext.Consumer>
      );
    }) as C;
  };
}
