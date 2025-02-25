// pages/User/DataTable/columns.tsx
import { ColumnDef, Row } from "@tanstack/react-table";
import { UserTableData, UserState } from "@/models";
import RoleCell from "./RoleCell";
import ActionCell from "./ActionsCell";
import StatusIndicator from "./StatusIndicator";

export const getColumns = (
  handleUserDeleted: (id: string) => void,
  handleUserDetails: (user: UserTableData) => void,
  handleUserStateChange: (userId: string, newState: UserState) => void,
  setData: React.Dispatch<React.SetStateAction<UserTableData[]>>,
  openAssignRoleModal: (userId: string, currentRoles: { id: string; name: string }[]) => void
): ColumnDef<UserTableData>[] => {
  
  return [
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
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => {
        const state = (Object.values(UserState) as string[]).includes(row.original.state)
          ? (row.original.state as UserState)
          : UserState.INACTIVE;

        return <StatusIndicator key={`${row.original.id}-${state}`} state={state} />;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <ActionCell
          user={row.original}
          onUserDeleted={handleUserDeleted}
          onUserStateChange={handleUserStateChange}
          onUserDetails={handleUserDetails}
        />
      ),
    },
  ];
};
