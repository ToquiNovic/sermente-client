// /pages/Company/dataTable/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { WorkerTableData } from "@/models";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell } from "./actionsCell";

export const getColumns = (
  handleUserDeleted: (id: string) => void,
  handleUserDetails: (user: WorkerTableData) => void
): ColumnDef<WorkerTableData>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean | "indeterminate") =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") =>
            row.toggleSelected(!!value)
          }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "numberDoc",
      header: "Número de Documento",
    },
    {
      accessorKey: "names",
      header: "Nombres",
    },
    {
      accessorKey: "surNames",
      header: "Apellidos",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
    },
    {
      id: "actions",
      header: ({ table }) => {
        const hasSelectedRows =
          table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected();

        return hasSelectedRows ? (
          <ActionsCell
            onWorkerDeleted={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);
              selectedIds.forEach(handleUserDeleted);
            }}
            onWorkerDetails={() => {
              const selectedWorkers = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original);
              selectedWorkers.forEach(handleUserDetails);
            }}
            multipleSelection
          />
        ) : (
          "Acciones"
        );
      },
      cell: ({ row }) => (
        <ActionsCell
          worker={row.original}
          onWorkerDeleted={handleUserDeleted}
          onWorkerDetails={handleUserDetails}
        />
      ),
    },
  ];
};
