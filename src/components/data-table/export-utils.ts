import { Row, Table } from "@tanstack/react-table";
import { downloadCSV } from "./csv-utils";
import React from "react";

export const handleTableExport = <TData,>(
  table: Table<TData>,
  columns: any[],
  rowSelection: Record<string, boolean>
) => {
  // Get visible columns excluding action and select columns
  const visibleColumns = columns.filter(
    (column) =>
      column.id !== "select" &&
      column.id !== "actions" &&
      table.getColumn(column.id)?.getIsVisible()
  );

  // Get column headers
  const headers = visibleColumns.map((column) => {
    const header = column.header;
    return typeof header === "string" ? header : column.id;
  });

  // Get rows to export (selected rows or all rows)
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const allRows = table.getFilteredRowModel().rows;
  const rowsToExport = Object.keys(rowSelection).length > 0 ? selectedRows : allRows;

  // Extract data from rows
  const rows = rowsToExport.map((row) =>
    visibleColumns.map((column) => {
      const cell = row.getAllCells().find((cell) => cell.column.id === column.id);
      if (!cell) return "";

      const value = cell.getValue();
      
      // Handle different value types
      if (value === null || value === undefined) return "";

      // Handle React elements (like badges or formatted content)
      if (React.isValidElement(value)) {
        const props = value.props as { children?: React.ReactNode };
        if (props.children) {
          // If children is an array, join them
          if (Array.isArray(props.children)) {
            return props.children.map(child => 
              typeof child === 'string' || typeof child === 'number' ? child : ''
            ).join(' ');
          }
          // If children is a single value
          return String(props.children);
        }
        return "";
      }

      // Handle objects (convert to string representation)
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      // Handle primitive values
      return String(value);
    })
  );

  // Download the CSV file
  downloadCSV(headers, rows);
};