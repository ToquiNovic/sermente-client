import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Ellipsis, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenuList } from "./utils";
import { logout } from "@/redux/states/userSlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "./collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";
import { LucideIcon } from "lucide-react";

// Tipos
interface Submenu {
  href: string;
  label: string;
  active?: boolean;
  adminOnly?: boolean;
}

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  submenus?: Submenu[];
  adminOnly?: boolean;
}

interface MenuGroup {
  groupLabel?: string;
  menus: MenuItem[];
}

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userPerfil, fetchUserDetails } = useUserProfile();
  const isAdmin =
    userPerfil?.roles?.some((role) => role.name === "Administrador") || false;
  const menuList = getMenuList(location.pathname);

  // Cargar detalles del usuario si no están disponibles
  useEffect(() => {
    if (!userPerfil) {
      fetchUserDetails();
    }
  }, [userPerfil, fetchUserDetails]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Filtrar los ítems del menú según el rol
  const filteredMenuList: MenuGroup[] = menuList.map((group) => ({
    ...group,
    menus: group.menus
      .filter((menu) => {
        const isMenuAllowed =
          !(menu.adminOnly ?? false) || (menu.adminOnly && isAdmin);
        if (menu.submenus && menu.submenus.length > 0) {
          return (
            isMenuAllowed ||
            menu.submenus.some(
              (submenu) =>
                !(submenu.adminOnly ?? false) || (submenu.adminOnly && isAdmin)
            )
          );
        }
        return isMenuAllowed;
      })
      .map((menu) => ({
        ...menu,
        submenus: menu.submenus
          ? menu.submenus
              .filter(
                (submenu) =>
                  !(submenu.adminOnly ?? false) ||
                  (submenu.adminOnly && isAdmin)
              )
              .map((submenu) => ({
                ...submenu,
                icon: Ellipsis, // Añadir icon por defecto para submenús
              }))
          : menu.submenus,
      })),
  }));

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {filteredMenuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, idx) =>
                !submenus || submenus.length === 0 ? (
                  <div className="w-full" key={idx}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              (active === undefined &&
                                location.pathname.startsWith(href)) ||
                              active
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <NavLink to={href}>
                              <span
                                className={cn(isOpen === false ? "" : "mr-4")}
                              >
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </p>
                            </NavLink>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">{label}</TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={idx}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={
                        active === undefined
                          ? location.pathname.startsWith(href)
                          : active
                      }
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                    onClick={handleLogout}
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Cerrar Sesión
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right" onClick={handleLogout}>
                    Cerrar Sesión
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
