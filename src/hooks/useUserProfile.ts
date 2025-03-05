import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getUser } from "@/services";
import { UserPerfil } from "@/models";

export function useUserProfile() {
  const [userPerfil, setUserPerfil] = useState<UserPerfil | null>(null);
  const userId = useSelector((state: RootState) => state.user?.id);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    try {
      const userDetails = await getUser(userId);
      setUserPerfil(userDetails);
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return { userPerfil, fetchUserDetails };
}
