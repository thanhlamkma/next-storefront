import { Menu } from "antd";
import { MenuTheme } from "antd/lib/menu/MenuContext";
import Link from "next/link";
import { MenuMode } from "rc-menu/lib/interface";
import React, { useCallback, useEffect, useState } from "react";
import { MenuItem } from "src/core/models/MenuItem";
import usePermissions from "src/core/permission/usePermissions";
import pathMatched from "src/core/utilities/pathMatched";

interface Props {
  items: MenuItem[];
  mode?: MenuMode;
  theme?: MenuTheme;
  className?: string;
  showChildren?: boolean;
  onCurrentMenuItemChange?: (item: MenuItem) => void;
}

const BaseMenu = ({
  items,
  mode,
  theme,
  className,
  showChildren = true,
  onCurrentMenuItemChange,
}: Props) => {
  const { can } = usePermissions();

  const [activeKey, setActiveKey] = useState<string>("");
  const [openKey, setOpenKey] = useState<React.ReactText>("");

  const onOpenChange = useCallback((keys: React.ReactText[]) => {
    if (keys.length) {
      setOpenKey(keys[1]);
    } else {
      setOpenKey("");
    }
  }, []);

  const setCurrentMenuItem = useCallback(
    (curItems: MenuItem[], parent?: MenuItem) => {
      for (const item of curItems) {
        if (pathMatched(location.pathname, item.path)) {
          if (
            showChildren &&
            !(typeof item.hideChildrenInMenu === "undefined"
              ? false
              : item.hideChildrenInMenu) &&
            item.routes
          ) {
            setCurrentMenuItem(item.routes, item);
            return;
          } else {
            if (item.routes && item.routes.length) {
              onCurrentMenuItemChange && onCurrentMenuItemChange(item);
              setActiveKey(item.path);
              return;
            } else if (pathMatched(location.pathname, item.path, true)) {
              onCurrentMenuItemChange && onCurrentMenuItemChange(item);
              setActiveKey(item.path);
              if (parent) {
                setOpenKey(parent.path);
              } else {
                setOpenKey("");
              }
              return;
            }
          }
        }
      }

      if (!parent) {
        setOpenKey("");
        setActiveKey("");
      }
    },
    [location.pathname, onCurrentMenuItemChange, showChildren]
  );

  useEffect(() => {
    setCurrentMenuItem(items);
  }, [setCurrentMenuItem, items]);

  const renderMenuItem = useCallback(
    (item: MenuItem) => {
      const childrenGrantedPermission = item.routes
        ? item.routes.filter((route) => can(route.permissions || [])).length > 0
        : false;
      const hasShowChildren = item.routes
        ? item.routes.filter(
            (route) =>
              typeof route.hideInMenu === "undefined" ||
              route.hideInMenu === false
          ).length > 0
        : false;

      return item.routes &&
        showChildren &&
        !(typeof item.hideChildrenInMenu === "undefined"
          ? false
          : item.hideChildrenInMenu) ? (
        childrenGrantedPermission && hasShowChildren ? (
          <Menu.SubMenu key={item.path} icon={item.icon} title={item.name}>
            {item.routes?.map((childItem) => {
              return renderMenuItem(childItem);
            })}
          </Menu.SubMenu>
        ) : null
      ) : (typeof item.hideInMenu === "undefined" ? false : item.hideInMenu) ||
        !can(item.permissions || []) ? null : (
        <Menu.Item key={item.path} title={item.name} icon={item.icon}>
          <Link href={item.path}>{item.name}</Link>
        </Menu.Item>
      );
    },
    [showChildren, can]
  );

  return (
    <Menu
      theme={theme}
      openKeys={[openKey.toString()]}
      selectedKeys={[activeKey]}
      mode={mode}
      className={className}
      onOpenChange={onOpenChange}
    >
      {items.map((item) => renderMenuItem(item))}
    </Menu>
  );
};

export default BaseMenu;
