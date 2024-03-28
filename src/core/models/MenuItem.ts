import { IRoute } from "src/core/models/routes";

export interface MenuItem extends IRoute {
  /** @name Hide child nodes in the menu */
  hideChildrenInMenu?: boolean;
  /** @name hideSelf and children in menu */
  hideInMenu?: boolean;
  /** @name Icon of the menu */
  icon?: React.ReactNode;
  /** @name The name of the menu */
  name?: string;
  /** @name disable menu option */
  disabled?: boolean;
  routes?: MenuItem[];
}
