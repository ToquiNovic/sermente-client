import { ColumnDef } from "@tanstack/react-table"

export type RoleTableData = {
  id: string
  name: string
  state: boolean
  description: string
}

export const columns: ColumnDef<RoleTableData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'state',
    header: 'Estado',
  },
]