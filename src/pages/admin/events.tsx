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
import { Eye, MoreHorizontal, Pencil, Trash, Calendar, Archive } from "lucide-react";
import { PollDetailsDialog } from "@/components/poll-details-dialog";
import { EditPollDialog } from "@/components/edit-poll-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePollsStore } from "@/stores/polls-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventsPage = () => {
  const { events, updateEvent, deleteEvent, toggleArchive } = useEventsStore();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [dialogOpen, setDialogOpen] = useState(false);

  const EmptyState = ({ type }: { type: "scheduled" | "archived" }) => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {type === "scheduled" ? (
        <Calendar className="h-12 w-12 text-muted-foreground" />
      ) : (
        <Archive className="h-12 w-12 text-muted-foreground" />
      )}
      <h3 className="text-lg font-semibold">
        {type === "scheduled" ? "No Events Scheduled" : "No Archived Events"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        {type === "scheduled"
          ? "There are no upcoming events scheduled at the moment. Create a new event to get started."
          : "No events have been archived yet. Events that are no longer active will appear here."}
      </p>
    </div>
  );

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
            {events.filter(event => !event.archived).length === 0 ? (
              <EmptyState type="scheduled" />
            ) : (
              <DataTable
                columns={columns}
                data={events.filter(event => !event.archived)}
              />
            )}
          </TabsContent>
          <TabsContent value="archived" className="space-y-4">
            {events.filter(event => event.archived).length === 0 ? (
              <EmptyState type="archived" />
            ) : (
              <DataTable
                columns={columns}
                data={events.filter(event => event.archived)}
              />
            )}
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
