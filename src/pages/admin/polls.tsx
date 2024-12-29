import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Pencil, XSquare } from "lucide-react";
import { usePollsStore } from "@/stores/polls-store";
import { PollDetailsDialog } from "@/components/poll-details-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PollsPage = () => {
  const { polls, updatePoll } = usePollsStore();
  const { toast } = useToast();
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const handleEdit = (poll: any) => {
    setEditingPoll({
      ...poll,
      options: [...poll.options]
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPoll) {
      updatePoll(editingPoll.id, editingPoll);
      toast({
        title: "Poll updated",
        description: "The poll has been successfully updated.",
      });
      setEditDialogOpen(false);
      setEditingPoll(null);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editingPoll.options];
    newOptions[index] = value;
    setEditingPoll({
      ...editingPoll,
      options: newOptions
    });
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const poll = row.original;

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
                  setSelectedPoll(poll.id);
                  setDetailsOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(poll)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updatePoll(poll.id, {
                    status: poll.status === "active" ? "closed" : "active",
                  });
                  toast({
                    title: `Poll ${
                      poll.status === "active" ? "closed" : "activated"
                    }`,
                    description: `The poll has been ${
                      poll.status === "active" ? "closed" : "activated"
                    }.`,
                  });
                }}
              >
                <XSquare className="mr-2 h-4 w-4" />
                {poll.status === "active" ? "Close" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-muted-foreground">Manage your polls</p>
        </div>

        <DataTable columns={columns} data={polls} />

        <PollDetailsDialog
          pollId={selectedPoll}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Poll</DialogTitle>
            </DialogHeader>
            {editingPoll && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingPoll.title}
                    onChange={(e) =>
                      setEditingPoll({ ...editingPoll, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Options</Label>
                  {editingPoll.options.map((option: string, index: number) => (
                    <div key={index} className="mt-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingPoll.startDate}
                    onChange={(e) =>
                      setEditingPoll({
                        ...editingPoll,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingPoll.endDate}
                    onChange={(e) =>
                      setEditingPoll({ ...editingPoll, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PollsPage;