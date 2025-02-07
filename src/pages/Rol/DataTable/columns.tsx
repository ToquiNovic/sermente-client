import { ColumnDef } from "@tanstack/react-table";
import { RoleTableData } from "@/models";
import ActionsCell from "./ActionsCell";

export const columns = (
  handleRoleDeleted: (id: string) => void,
  handleRoleUpdated: (updatedRole: RoleTableData) => void
): ColumnDef<RoleTableData>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => (
      <span className={row.original.state ? "text-green-600" : "text-red-600"}>
        {row.original.state ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <ActionsCell
        role={row.original}
        onRoleDeleted={handleRoleDeleted}
        onRoleUpdated={handleRoleUpdated}
      />
    ),
  },
];
