import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAnnouncementsStore } from "@/stores/announcements-store";
import { AnnouncementDialog } from "@/components/announcement-dialog";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AnnouncementsPage = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, fetchAnnouncements, isLoading } = useAnnouncementsStore();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const columns = [
    {
      accessorKey: "details",
      header: "Details",
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const announcement = row.original;

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
                  toast({
                    title: "Announcement Details",
                    description: announcement.details,
                  });
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAnnouncement(announcement.id);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedAnnouncement(announcement.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleCreate = async (details: string) => {
    await addAnnouncement({
      details,
      createdBy: "Admin User",
    });
  };

  const handleEdit = async (details: string) => {
    if (selectedAnnouncement) {
      await updateAnnouncement(selectedAnnouncement, details);
      setSelectedAnnouncement(null);
    }
  };

  const handleDelete = async () => {
    if (selectedAnnouncement) {
      await deleteAnnouncement(selectedAnnouncement);
      setSelectedAnnouncement(null);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    }
    setDeleteDialogOpen(false);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Megaphone className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No Announcements</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        There are no announcements yet. Create your first announcement to share important updates with your community.
      </p>
      <Button onClick={() => setCreateDialogOpen(true)}>
        Create Announcement
      </Button>
    </div>
  );

  const selectedAnnouncementData = announcements.find(
    (a) => a.id === selectedAnnouncement
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">
              Manage your community announcements
            </p>
          </div>
          {announcements.length > 0 && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              Create Announcement
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : announcements.length === 0 ? (
          <EmptyState />
        ) : (
          <DataTable columns={columns} data={announcements} />
        )}

        <AnnouncementDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreate}
          mode="create"
        />

        <AnnouncementDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEdit}
          initialDetails={selectedAnnouncementData?.details}
          mode="edit"
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                announcement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AnnouncementsPage;