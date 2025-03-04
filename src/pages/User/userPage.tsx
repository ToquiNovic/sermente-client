// pages/User/userPage.tsx
import { useEffect, useState } from "react";
import { getColumns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getUsers } from "./service";
import { CreateUser } from "./create-user";
import { UserTableData, UserState } from "@/models";
import { useAssignRole } from "./useAssignRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

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
        if (!Array.isArray(users)) {
          throw new Error("La respuesta de getUsers no es un array válido");
        }

        const formattedUsers = users.map((user) => ({
          ...user,
          state: Object.values(UserState).includes(user.state as UserState)
            ? (user.state as UserState)
            : UserState.ACTIVE,
        }));

        setData(formattedUsers);
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
    <ContentLayout title="Usuarios">
      <div className="w-full">
      <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
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
          key={data.length}
          columns={getColumns(
            (id) => setData((prev) => prev.filter((user) => user.id !== id)),
            (user: UserTableData) => console.log("Detalles del usuario:", user),
            (id: string, newState: UserState) => {
              setData((prev) =>
                prev.map((user) =>
                  user.id === id ? { ...user, state: newState } : user
                )
              );
            },
            setData,
            openAssignRoleModal
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
    </ContentLayout>
  );
};

export default UserPage;
