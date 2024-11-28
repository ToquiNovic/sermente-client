import { useEffect, useState } from "react";
import { RoleTableData, columns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getRoles } from "./service/roleService";

const RolePage = () => {
  const [data, setData] = useState<RoleTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await getRoles();
        const formattedData = roles.map((role) => ({
          id: role.id,
          name: role.name,
          state: role.state,
          description: role.description || "Sin descripción",
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching roles:", error);
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
      <h1>RolePage</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default RolePage;
