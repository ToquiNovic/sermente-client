import { useState, useEffect } from "react";
import { assignRoleToUser } from "./service";
import { getRoles } from "../Rol/service";
import { Role, UserTableData } from "@/models";

export const useAssignRole = (
  setData: (callback: (prevData: UserTableData[]) => UserTableData[]) => void
) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const activeRoles: Role[] = await getRoles();
        setRoles(activeRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const openAssignRoleModal = (userId: string, currentRoles: { id: string; name: string }[]) => {
    setSelectedUserId(userId);
    setUserRoles(currentRoles);
    setIsModalOpen(true);
  };

  const handleAssignRole = async (roleId: string) => {
    if (!selectedUserId) return;

    try {
      await assignRoleToUser(selectedUserId, roleId);

      const newRole = roles.find((role) => String(role.id) === String(roleId));
      if (!newRole) return;

      // 🔥 Actualizar la lista de roles del usuario en la tabla
      setUserRoles((prevRoles) => [...prevRoles, newRole]);

      setData((prevData) =>
        prevData.map((user) =>
          user.id === selectedUserId ? { ...user, roles: [...user.roles, newRole] } : user
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  return { roles, isModalOpen, openAssignRoleModal, handleAssignRole, setIsModalOpen, userRoles };
};
