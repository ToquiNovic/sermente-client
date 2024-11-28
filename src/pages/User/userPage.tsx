import { useEffect, useState } from "react";
import { UserTableData, columns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getUsers } from "./service/user.service";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Page</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UserPage;
