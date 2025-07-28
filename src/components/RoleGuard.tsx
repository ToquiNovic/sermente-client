import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { useUserProfile } from "@/hooks";
import {
  getMenuList,
  type Group,
  type Menu,
  type Submenu,
} from "@/components/app/sidebar/utils";
import { Spinner } from "@/components";

export const RoleGuard = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.user.userPerfil?.roles);
  const userId = useSelector((state: RootState) => state.user.id);
  const { fetchUserDetails } = useUserProfile();

  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUserDetails();

        const fullPath = location.pathname;
        const normalizedPath = fullPath.replace(/\/$/, "");

        const allMenus = getMenuList(normalizedPath)
          .flatMap((group: Group) => group.menus)
          .flatMap((menu: Menu) => [
            ...(menu.roles ? [{ href: menu.href, roles: menu.roles }] : []),
            ...(menu.submenus
              ? menu.submenus.map((sub: Submenu) => ({
                  href: sub.href,
                  roles: sub.roles,
                }))
              : []),
          ]);

        const currentMenu = allMenus.find((m) => m.href === normalizedPath);

        if (!currentMenu) {
          setHasAccess(true);
        } else {
          const allowed = currentMenu.roles?.some((requiredRole) =>
            role?.some((r) => r.name === requiredRole)
          );
          setHasAccess(allowed ?? false);
        }
      } catch (error) {
        console.error("Error al verificar permisos:", error);
        toast.error("Error al verificar permisos");
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fetchUserDetails, location.pathname, role]);

  if (!userId) return <Navigate to="/" replace />;
  if (isLoading) return <Spinner />;
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};
