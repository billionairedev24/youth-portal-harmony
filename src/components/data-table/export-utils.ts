import { Row, Table } from "@tanstack/react-table";
import { downloadCSV } from "./csv-utils";
import React from "react";

export const handleTableExport = <TData,>(
  table: Table<TData>,
  columns: any[],
  rowSelection: Record<string, boolean>
) => {
  const visibleColumns = columns.filter(
    (column) =>
      column.id !== "select" &&
      column.id !== "actions" &&
      table.getColumn(column.id)?.getIsVisible()
  );

  const headers = visibleColumns.map((column) => {
    const header = column.header;
    return typeof header === "string" ? header : column.id;
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const allRows = table.getFilteredRowModel().rows;
  const rowsToExport = Object.keys(rowSelection).length > 0 ? selectedRows : allRows;

  const rows = rowsToExport.map((row) =>
    visibleColumns.map((column) => {
      const cell = row.getAllCells().find((cell) => cell.column.id === column.id);
      if (!cell) return "";

      const value = cell.getValue();
      if (value === null || value === undefined) return "";

      if (typeof value === "object") {
        if (React.isValidElement(value)) {
          const props = value.props as { children?: React.ReactNode };
          return props.children ? String(props.children) : "";
        }
        return JSON.stringify(value);
      }

      return String(value);
    })
  );

  downloadCSV(headers, rows);
};