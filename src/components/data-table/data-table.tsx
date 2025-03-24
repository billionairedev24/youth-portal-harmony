
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { handleTableExport } from "./export-utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

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
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Custom global filter function that searches all string values
  const globalFilterFn: FilterFn<TData> = (row, columnId, filterValue) => {
    // Look through all column values for this row
    const allValues = Object.entries(row.original as Record<string, any>);
    return allValues.some(([key, value]) => {
      // Skip non-string/number values or null/undefined
      if (value === null || value === undefined) return false;
      if (typeof value === 'object') {
        // Try to stringify objects for searching
        try {
          value = JSON.stringify(value);
        } catch (e) {
          return false;
        }
      }
      
      // Convert to string and check if it includes the filter value
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const columns = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,  // Use our custom filter function
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      onExport: () => handleTableExport(table, columns, rowSelection),
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
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
