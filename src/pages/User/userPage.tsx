// @/pages/User/userPage.tsx
import { useEffect, useState } from "react";
import { getColumns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getUsers } from "./service";
import { CreateUser } from "./create-user";
import { UserTableData } from "@/models";
import { useAssignRole } from "./useAssignRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UserPage = () => {
  const [data, setData] = useState<UserTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    roles,
    isModalOpen,
    openAssignRoleModal,
    handleAssignRole,
    setIsModalOpen,
    userRoles,
  } = useAssignRole(setData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1>Lista de Usuarios</h1>
      <div className="flex items-center py-4">
        <CreateUser
          onUserCreated={(newUser) => {
            setData((prev) => [newUser, ...prev]);
          }}
          setData={setData}
        />
      </div>
      <div className="rounded-md border">
        <DataTable
          columns={getColumns(
            setData,
            (userId: string, currentRoles: { id: string; name: string }[]) =>
              openAssignRoleModal(
                userId,
                currentRoles.map(({ id, name }) => ({
                  id: id.toString(),
                  name,
                }))
              )
          )}
          data={data}
        />
      </div>

      {/* Modal para asignar roles */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Rol</DialogTitle>
            <DialogDescription>
              Selecciona un rol para asignarlo al usuario.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {roles.length === userRoles.length ? (
              <p className="text-center text-gray-500 italic">
                Ya tienes todos los roles asignados.
              </p>
            ) : (
              roles
                .filter(
                  (role) =>
                    !userRoles.some(
                      (userRole) => String(userRole.id) === String(role.id)
                    )
                )
                .map((role) => (
                  <Button
                    key={role.id}
                    className="w-full"
                    onClick={() => handleAssignRole(role.id.toString())}
                  >
                    {role.name}
                  </Button>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPage;
