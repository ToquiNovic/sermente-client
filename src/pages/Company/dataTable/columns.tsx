// /pages/Company/dataTable/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { WorkerTableData } from "@/models";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell } from "./actionsCell";

export const getColumns = (
  handleUserDeleted: (id: string) => void,
  handleUserDetails: (user: WorkerTableData) => void,
  companyId: string
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
          onCheckedChange={(value: boolean | "indeterminate") => {
            row.toggleSelected(!!value);
          }}
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
            companyId={companyId}
            onWorkerDeleted={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);

              if (selectedIds.length === 0) return null;
              selectedIds.forEach(handleUserDeleted);
            }}
            onWorkerDetails={() => {
              const selectedWorkers = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original);

              if (selectedWorkers.length === 0) return null;
              selectedWorkers.forEach(handleUserDetails);
            }}
            multipleSelection
            selectedWorkers={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
          />
        ) : (
          "Acciones"
        );
      },
      cell: ({ row, table }) => {
        const worker = row.original;

        // 👇 ocultar las acciones en las filas cuando hay selección múltiple
        const hasSelectedRows =
          table.getIsSomeRowsSelected() || table.getIsAllPageRowsSelected();

        if (!worker || !worker.id || hasSelectedRows) {
          return null;
        }

        return (
          <ActionsCell
            companyId={companyId}
            worker={worker}
            onWorkerDeleted={handleUserDeleted}
            onWorkerDetails={handleUserDetails}
          />
        );
      },
    },
  ];
};
