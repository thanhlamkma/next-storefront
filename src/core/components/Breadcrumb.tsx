import { Breadcrumb } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuItem } from "src/core/models/MenuItem";
import pathMatched from "src/core/utilities/pathMatched";

interface BreadcrumbProps {
  current: MenuItem;
  routes: MenuItem[];
}

const getListMatchedRoutes = (
  current: MenuItem,
  routes: MenuItem[],
  result: MenuItem[] = []
) => {
  for (const route of routes) {
    if (pathMatched(current.path, route.path)) {
      if (route.routes) {
        result.push(route);
        result = [...result, ...getListMatchedRoutes(current, route.routes)];
        break;
      } else if (pathMatched(current.path, route.path, true)) {
        result.push(route);
        break;
      }
    }
  }

  return result;
};

const BaseBreadcrumb = ({ routes, current }: BreadcrumbProps) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setBreadcrumbItems(getListMatchedRoutes(current, routes));
  }, [routes, current]);

  return (
    <Breadcrumb>
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={index}>
          <Link href={item.path}>
            {item.name || item.pageTitle || item.documentTitle}
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BaseBreadcrumb;
