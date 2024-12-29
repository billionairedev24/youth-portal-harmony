import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const UserDashboard = () => {
  const { events } = useEventsStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const activeEvents = events.filter(event => !event.archived);

  const selectedDateEvents = activeEvents.filter(
    event => event.date === format(date || new Date(), 'yyyy-MM-dd')
  );

  const eventDates = activeEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    acc[format(eventDate, 'yyyy-MM-dd')] = event;
    return acc;
  }, {} as Record<string, typeof activeEvents[0]>);

  const modifiers = {
    hasEvent: (date: Date) => {
      return format(date, 'yyyy-MM-dd') in eventDates;
    }
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'rgba(234, 179, 8, 0.1)',
      fontWeight: 'bold'
    }
  };

  const renderEventTooltip = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const event = eventDates[dateStr];
    
    if (!event) return null;

    return (
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{event.title}</h4>
          <p className="text-sm text-muted-foreground">{event.objectives}</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {activeEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <HoverCard key={event.id}>
                      <HoverCardTrigger asChild>
                        <div style={{ position: 'absolute', visibility: 'hidden' }}>
                          Trigger
                        </div>
                      </HoverCardTrigger>
                      {renderEventTooltip(eventDate)}
                    </HoverCard>
                  );
                })}
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDateEvents.length > 0 
                  ? `Events on ${format(date || new Date(), 'MMMM d, yyyy')}`
                  : "Upcoming Events"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {(selectedDateEvents.length > 0 ? selectedDateEvents : activeEvents)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg bg-secondary/50 space-y-2"
                      >
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.objectives}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {(selectedDateEvents.length === 0 && activeEvents.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">
                      No upcoming events
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;
