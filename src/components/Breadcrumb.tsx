import { Link, useLocation } from "react-router-dom";
import { getMenuList } from "./app/sidebar/utils";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;
  const menuList = getMenuList(pathname);

  const breadcrumbItems = [];
  
  // Recorrer las secciones del menú para encontrar la ruta actual
  for (const group of menuList) {
    for (const menu of group.menus) {
      if (menu.href === pathname) {
        breadcrumbItems.push({ label: menu.label, href: menu.href });
      }
      if (menu.submenus) {
        for (const submenu of menu.submenus) {
          if (submenu.href === pathname) {
            breadcrumbItems.push(
              { label: menu.label, href: menu.href },
              { label: submenu.label, href: submenu.href }
            );
          }
        }
      }
    }
  }

  return (
    <nav className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
      <Link to="/dashboard" className="hover:text-gray-700">Inicio</Link>
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link to={item.href} className="hover:text-gray-700">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
