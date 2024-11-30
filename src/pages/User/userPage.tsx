// pages/User/userPage.tsx
import { useEffect, useState } from "react";
import { UserTableData, columns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getUsers } from "./service/user.service";
import { CreateUser } from "./create-user";

const UserPage = () => {
  const [data, setData] = useState<UserTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();

        const formattedData = users.map((user) => ({
          id: user.id,
          numerDoc: user.numberDoc,
          rol: `Rol ${user.roleId}`,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para agregar el usuario recién creado al estado local
  const handleUserCreated = (newUser: UserTableData) => {
    setData((prevData) => [newUser, ...prevData]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1>User Page</h1>
      <div className="flex items-center py-4">
        Nuevo Usuario
        <CreateUser onUserCreated={handleUserCreated} />
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default UserPage;

