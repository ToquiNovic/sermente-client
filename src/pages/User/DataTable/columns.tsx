import { ColumnDef, Row } from "@tanstack/react-table";
import { UserTableData } from "@/models";
import RoleCell from "./RoleCell";

export const getColumns = (
  setData: React.Dispatch<React.SetStateAction<UserTableData[]>>,
  openAssignRoleModal: (userId: string, currentRoles: { id: string; name: string }[]) => void
): ColumnDef<UserTableData>[] => [
  {
    accessorKey: "numberDoc",
    header: "Número de Documento",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }: { row: Row<UserTableData> }) => (
      <RoleCell
        roles={row.getValue("roles")}
        userId={row.original.id}
        setData={setData}
        openAssignRoleModal={openAssignRoleModal}
      />
    ),
  },
];
