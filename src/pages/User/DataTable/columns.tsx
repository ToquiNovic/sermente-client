import { ColumnDef } from "@tanstack/react-table";

export type UserTableData = {
  id: string;
  numerDoc: string;
  rol: string;
};

export const columns: ColumnDef<UserTableData>[] = [
  {
    accessorKey: "numerDoc",
    header: "Numero de Documento",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
];
