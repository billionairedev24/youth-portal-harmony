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
import { Archive, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

type Event = {
  id: string;
  title: string;
  objectives: string;
  personnel: string;
  location: string;
  date: string;
  time: string;
  archived: boolean;
};

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Youth Sunday Service",
    objectives: "Weekly worship and fellowship",
    personnel: "Pastor John, Youth Leaders",
    location: "Main Hall",
    date: "2024-03-10",
    time: "10:00 AM",
    archived: false,
  },
  {
    id: "2",
    title: "Bible Study",
    objectives: "Deep dive into Scripture",
    personnel: "Sarah Smith",
    location: "Room 101",
    date: "2024-03-12",
    time: "7:00 PM",
    archived: false,
  },
];

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);

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

        const handleArchive = () => {
          setEvents(events.map(e => 
            e.id === event.id ? { ...e, archived: !e.archived } : e
          ));
        };

        const handleDelete = () => {
          setEvents(events.filter(e => e.id !== event.id));
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                {event.archived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
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
      </div>
    </AdminLayout>
  );
};

export default EventsPage;