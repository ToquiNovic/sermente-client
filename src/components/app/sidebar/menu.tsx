import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut, Ellipsis } from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/redux/states/userSlice";
import { getMenuList } from "./utils";
import { useUserProfile } from "@/hooks/useUserProfile";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "./collapse-menu-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userPerfil, fetchUserDetails } = useUserProfile();
  const menuList = getMenuList(location.pathname, userPerfil?.roles[0]?.name || "");

  useEffect(() => {
    if (!userPerfil) fetchUserDetails();
  }, [userPerfil, fetchUserDetails]);

  const handleLogout = () => dispatch(logout());

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {groupLabel &&
                (isOpen || isOpen === undefined ? (
                  <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                    {groupLabel}
                  </p>
                ) : (
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
                ))}

              {menus
                .filter(
                  (menu) =>
                    !menu.roles ||
                    userPerfil?.roles?.some((role) =>
                      menu.roles!.includes(role.name)
                    )
                )
                .map(
                  ({ href, label, icon: Icon, active, submenus = [] }, idx) => {
                    const visibleSubmenus = submenus.filter(
                      (submenu) =>
                        !submenu.roles ||
                        userPerfil?.roles?.some((role) =>
                          submenu.roles!.includes(role.name)
                        )
                    );

                    if (visibleSubmenus.length > 0) {
                      return (
                        <CollapseMenuButton
                          key={idx}
                          icon={Icon}
                          label={label}
                          active={active ?? location.pathname.startsWith(href)}
                          submenus={visibleSubmenus}
                          isOpen={isOpen}
                        />
                      );
                    }

                    const isActive =
                      active ?? location.pathname.startsWith(href);

                    return (
                      <TooltipProvider key={idx} disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
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
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }
                )}
            </li>
          ))}

          {/* Botón cerrar sesión */}
          <li className="w-full grow flex items-end">
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  className="w-full justify-center h-10 mt-5 border border-input bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                  onClick={handleLogout}
                >
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <LogOut size={18} />
                  </span>
                  <p
                    className={cn(
                      "whitespace-nowrap group-hover:text-white transition-colors",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}
                  >
                    Cerrar Sesión
                  </p>
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent side="right">Cerrar Sesión</TooltipContent>
              )}
            </Tooltip>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
