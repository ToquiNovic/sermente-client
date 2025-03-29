import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/app/DataTablePagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DataTableProps<TData extends Record<string, unknown>> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export const DataTable = <TData extends Record<string, unknown>>({ columns, data }: DataTableProps<TData>) => {
  const [filterValue, setFilterValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const filteredData = useMemo(() => {
    if (!filterValue) return data;
    return data.filter((row) =>
      (Object.keys(row) as (keyof TData)[]).some((key) =>
        String(row[key]).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [data, filterValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return (
      <div>
        <div className="flex items-center py-4 space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                placeholder="Buscar Usuario..."
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </TooltipTrigger>
            <TooltipContent>
              Puedes buscar por nombre, apellido, documento, teléfono o correo.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-4 text-gray-500">
                    No hay campos con ese valor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <span>{Object.keys(rowSelection).length} fila(s) seleccionada(s).</span>
          <DataTablePagination table={table} />
        </div>
      </div>
  );
};
