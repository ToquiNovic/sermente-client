import { useEffect, useState } from "react";
import { columns } from "./DataTable/columns";
import DataTable from "./DataTable/data-table";
import { getRoles } from "./service/role.service";
import { CreateRole } from "./create-role";
import { RoleTableData } from "@/models";
import { ContentLayout } from "@/components/app/sidebar/content-layout";

const RolePage = () => {
  const [data, setData] = useState<RoleTableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await getRoles();
        const formattedData = roles
          .map((role) => ({
            id: role.id,
            name: role.name,
            state: role.state,
            description: role.description || "Sin descripción",
          }))
          .sort((a, b) => Number(a.id) - Number(b.id));
          
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejo de creación de un nuevo rol
  const handleRoleCreated = (newRole: RoleTableData) => {
    setData((prevData) =>
      [...prevData, newRole].sort((a, b) => Number(a.id) - Number(b.id))
    );
  };

  // Manejo de eliminación de un rol
  const handleRoleDeleted = (id: string) => {
    setData((prevData) =>
      prevData.filter((r) => r.id !== id).sort((a, b) => Number(a.id) - Number(b.id))
    );
  };

  // Manejo de actualización de un rol
  const handleRoleUpdated = (updatedRole: RoleTableData) => {
    setData((prevData) =>
      prevData
        .map((r) => (r.id === updatedRole.id ? updatedRole : r))
        .sort((a, b) => Number(a.id) - Number(b.id))
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ContentLayout title="Roles">
      <div className="w-full">
      <h1>Lista de Roles</h1>
      <div className="flex items-center py-4">
        <CreateRole onRoleCreated={handleRoleCreated} />
      </div>
      <div className="rounded-md border">
        <DataTable columns={columns(handleRoleDeleted, handleRoleUpdated)} data={data} />
      </div>
    </div>
    </ContentLayout>
  );
};

export default RolePage;
