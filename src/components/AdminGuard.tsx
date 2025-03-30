import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components";
import { useUserProfile } from "@/hooks";
import { DashboardAccess } from "@/config";

export const AdminGuard = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const { userPerfil, fetchUserDetails } = useUserProfile();

  useEffect(() => {
    const loadUser = async () => {
      await fetchUserDetails();
      setIsLoading(false);
    };
    loadUser();
  }, [fetchUserDetails]);

  if (isLoading) {
    return <Spinner />;
  }

  const isLoggedIn = !!user?.accessToken;
  const hasAdminAccess = userPerfil?.roles?.some((role) =>
    DashboardAccess.includes(role.name)
  );

  if (!isLoggedIn) return <Navigate to="/" />;
  if (!hasAdminAccess) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};
