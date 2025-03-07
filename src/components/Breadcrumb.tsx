import { Link, useLocation } from "react-router-dom";
import { getMenuList } from "@/components/app/sidebar/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { House } from "lucide-react";

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;
  const menuList = getMenuList(pathname);

  const breadcrumbItems = [];
  let groupLabel = "Dashboard";

  for (const group of menuList) {
    for (const menu of group.menus) {
      if (menu.href === pathname) {
        breadcrumbItems.push({ label: menu.label, href: menu.href });
        groupLabel = group.groupLabel;
      }
      if (menu.submenus) {
        for (const submenu of menu.submenus) {
          if (submenu.href === pathname) {
            breadcrumbItems.push(
              { label: menu.label, href: menu.href },
              { label: submenu.label, href: submenu.href }
            );
            groupLabel = group.groupLabel;
          }
        }
      }
    }
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">
              <House className="w-4 h-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && groupLabel ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">{groupLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> 
          </>
        ) : <BreadcrumbSeparator />}

        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
