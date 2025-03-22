
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  hasRowSelection: boolean;
}

export function DataTableToolbar<TData>({
  table,
  hasRowSelection,
}: DataTableToolbarProps<TData>) {
  // Get the first filterable column
  const firstFilterableColumn = table.getAllColumns().find(
    column => column.getCanFilter()
  );

  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Filter..."
        value={(firstFilterableColumn?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          firstFilterableColumn?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
        disabled={!firstFilterableColumn}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            if (table.options.meta?.onExport) {
              table.options.meta.onExport();
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export {hasRowSelection ? "Selected" : "All"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
