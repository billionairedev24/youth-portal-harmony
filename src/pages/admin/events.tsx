import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Event, useEventsStore } from "@/stores/events-store";
import { EventDialog } from "@/components/event-dialog";
import { useToast } from "@/components/ui/use-toast";

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { events, updateEvent, deleteEvent, toggleArchive } = useEventsStore();

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSave = (updatedEvent: Partial<Event>) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, updatedEvent);
      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
      });
    }
  };

  const handleArchive = (event: Event) => {
    toggleArchive(event.id);
    toast({
      title: event.archived ? "Event unarchived" : "Event archived",
      description: `The event has been ${event.archived ? "unarchived" : "archived"}.`,
    });
  };

  const handleDelete = (event: Event) => {
    deleteEvent(event.id);
    toast({
      title: "Event deleted",
      description: "The event has been permanently deleted.",
      variant: "destructive",
    });
  };

  const columns = [
    {
      accessorKey: "title",
      header: "What",
    },
    {
      accessorKey: "objectives",
      header: "Objective(s)",
    },
    {
      accessorKey: "personnel",
      header: "Personnel",
    },
    {
      accessorKey: "location",
      header: "Where",
    },
    {
      accessorKey: "date",
      header: "When",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(event)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(event)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleArchive(event)}>
                <Archive className="mr-2 h-4 w-4" />
                {event.archived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(event)}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
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
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage your youth group events
          </p>
        </div>

        <Tabs defaultValue="scheduled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheduled">Scheduled Events</TabsTrigger>
            <TabsTrigger value="archived">Archived Events</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled" className="space-y-4">
            <DataTable
              columns={columns}
              data={events.filter(event => !event.archived)}
            />
          </TabsContent>
          <TabsContent value="archived" className="space-y-4">
            <DataTable
              columns={columns}
              data={events.filter(event => event.archived)}
            />
          </TabsContent>
        </Tabs>

        <EventDialog
          event={selectedEvent}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          mode={dialogMode}
        />
      </div>
    </AdminLayout>
  );
};

export default EventsPage;