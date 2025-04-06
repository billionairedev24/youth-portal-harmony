import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useEventsStore } from '@/stores/events-store';
import { AdminLayout } from '@/components/admin-layout';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Event } from "@/stores/events-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  Calendar, 
  Archive, 
  Plus, 
  UserPlus 
} from 'lucide-react';
import { EventDialog } from '@/components/event-dialog';
import { RecordAttendanceDialog } from '@/components/admin/record-attendance-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';

const EventsPage = () => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    toggleArchive, 
    recordAttendance,
    fetchEvents,
    loading
  } = useEventsStore();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

  const handleCreateEvent = () => {
    setSelectedEvent({
      title: '',
      objectives: '',
      personnel: '',
      location: '',
      date: '',
      time: '',
      archived: false,
    });
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleSave = async (eventData: Event) => {
    try {
      if (dialogMode === 'create') {
        await addEvent(eventData);
        toast.success('Event created successfully');
      } else {
        await updateEvent(eventData.id, eventData);
        toast.success('Event updated successfully');
      }
      setDialogOpen(false);
      // Refresh events to ensure consistency
      await fetchEvents();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await toggleArchive(id);
      toast.success('Event archive status updated');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to toggle archive status');
    }
  };

  const handleRecordAttendance = async (
    eventId: string, 
    menCount: number, 
    womenCount: number
  ) => {
    try {
      await recordAttendance(eventId, menCount, womenCount);
      toast.success('Attendance recorded successfully');
      setAttendanceDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to record attendance');
    }
  };

  const columns = useMemo<ColumnDef<Event>[]>(() => [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const event = row.original;
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
                  setSelectedEvent(event);
                  setDialogMode('view');
                  setDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEvent(event);
                  setDialogMode('edit');
                  setDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEvent(event);
                  setAttendanceDialogOpen(true);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Record Attendance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleArchive(event.id)}
              >
                <Archive className="mr-2 h-4 w-4" />
                {event.archived ? 'Restore' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(event.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const EmptyState = ({ type }: { type: 'scheduled' | 'archived' }) => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-secondary/20 rounded-lg border-2 border-dashed border-secondary">
      {type === 'scheduled' ? (
        <Calendar className="h-12 w-12 text-muted-foreground" />
      ) : (
        <Archive className="h-12 w-12 text-muted-foreground" />
      )}
      <h3 className="text-lg font-semibold">
        {type === 'scheduled' ? 'No Events Scheduled' : 'No Archived Events'}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        {type === 'scheduled'
          ? 'There are no upcoming events scheduled at the moment. Create a new event to get started.'
          : 'No events have been archived yet. Events that are no longer active will appear here.'}
      </p>
      {type === 'scheduled' && (
        <Button 
          onClick={handleCreateEvent} 
          variant="default" 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create your first event
        </Button>
      )}
    </div>
  );

  const activeEvents = events.filter(event => !event.archived);
  const archivedEvents = events.filter(event => event.archived);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">
              Manage your youth group events
            </p>
          </div>
          {activeEvents.length > 0 && (
            <Button 
              onClick={handleCreateEvent} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>

        <Tabs defaultValue="scheduled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scheduled">Scheduled Events</TabsTrigger>
            <TabsTrigger value="archived">Archived Events</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled" className="space-y-4">
            {activeEvents.length === 0 ? (
              <EmptyState type="scheduled" />
            ) : (
              <DataTable
                columns={columns}
                data={activeEvents}
              />
            )}
          </TabsContent>
          <TabsContent value="archived" className="space-y-4">
            {archivedEvents.length === 0 ? (
              <EmptyState type="archived" />
            ) : (
              <DataTable
                columns={columns}
                data={archivedEvents}
              />
            )}
          </TabsContent>
        </Tabs>

        <EventDialog
          event={selectedEvent}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          mode={dialogMode === 'view' ? 'view' : 'edit'}
          isLoading={loading}
        />

        {selectedEvent && (
          <RecordAttendanceDialog
            event={selectedEvent}
            open={attendanceDialogOpen}
            onOpenChange={setAttendanceDialogOpen}
            onSave={handleRecordAttendance}
            isLoading={loading}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default EventsPage;