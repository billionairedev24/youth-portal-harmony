import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { downloadCSV } from "./csv-utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Define the extended TableMeta type
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends unknown> {
    onExport?: () => void;
  }
}

export function DataTable<TData, TValue>({
  columns: userColumns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...userColumns,
  ], [userColumns]);

  const handleExport = React.useCallback((tableInstance: TableType<TData>) => {
    const visibleColumns = columns
      .filter((column) => 
        column.id !== "select" && 
        column.id !== "actions" && 
        tableInstance.getColumn(column.id)?.getIsVisible()
      );
    
    const headers = visibleColumns
      .map((column) => {
        const header = column.header;
        return typeof header === 'string' ? header : column.id;
      });
    
    const selectedRows = tableInstance.getFilteredSelectedRowModel().rows;
    const allRows = tableInstance.getFilteredRowModel().rows;
    const rowsToExport = Object.keys(rowSelection).length > 0 ? selectedRows : allRows;

    const rows = rowsToExport.map((row) =>
      visibleColumns.map((column) => {
        const cell = row.getAllCells().find(cell => cell.column.id === column.id);
        if (!cell) return '';
        
        const value = cell.getValue();
        if (value === null || value === undefined) return '';
        
        // Handle different types of cell content
        if (typeof value === 'object') {
          if (React.isValidElement(value)) {
            // If it's a React element, try to get text content
            return value.props.children || '';
          }
          return JSON.stringify(value);
        }
        
        return String(value);
      })
    );

    downloadCSV(headers, rows);
  }, [columns, rowSelection]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onExport: () => handleExport(table),
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar 
        table={table}
        hasRowSelection={Object.keys(rowSelection).length > 0}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}