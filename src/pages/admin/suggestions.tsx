import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Inbox } from "lucide-react";
import { useState } from "react";
import { useSuggestionsStore } from "@/stores/suggestions-store";
import { type ColumnDef } from "@tanstack/react-table";
import { type Suggestion } from "@/stores/suggestions-store";
import { SuggestionDialog } from "@/components/suggestion-dialog";
import { format } from "date-fns";
import { toast } from "sonner";

const SuggestionsPage = () => {
  const { suggestions, updateSuggestionStatus } = useSuggestionsStore();
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: ColumnDef<Suggestion>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "authorName",
      header: "Author",
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => format(new Date(row.original.createdAt), "PP"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "new" ? "default" : "secondary"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const suggestion = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSuggestion(suggestion);
                  setDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleStatusChange = (id: string, status: "new" | "processed", comment?: string) => {
    updateSuggestionStatus(id, status, comment);
    toast.success("Suggestion status updated successfully");
    setDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Suggestions</h1>
          <p className="text-muted-foreground">
            View and manage member suggestions
          </p>
        </div>

        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 bg-white/50 backdrop-blur-sm rounded-lg p-12 border border-gold-200/50">
            <div className="h-12 w-12 rounded-full bg-gold-100 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-gold-600" />
            </div>
            <h3 className="text-xl font-semibold text-gold-900">No Suggestions Yet</h3>
            <p className="text-gold-600 text-center max-w-sm">
              When members submit suggestions, they will appear here for review.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={suggestions} />
        )}

        <SuggestionDialog
          suggestion={selectedSuggestion}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onStatusChange={handleStatusChange}
          mode="review"
        />
      </div>
    </AdminLayout>
  );
};

export default SuggestionsPage;