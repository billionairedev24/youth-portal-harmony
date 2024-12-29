import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const UserDashboard = () => {
  const { events } = useEventsStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const activeEvents = events.filter(event => !event.archived);

  const selectedDateEvents = activeEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return date ? isSameDay(eventDate, date) : isSameDay(eventDate, new Date());
  });

  const eventDates = activeEvents.reduce((acc, event) => {
    const eventDate = parseISO(event.date);
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
      fontWeight: 'bold',
      backgroundColor: 'rgba(234, 179, 8, 0.1)'
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {Object.entries(eventDates).map(([dateStr, event]) => {
                  const eventDate = parseISO(dateStr);
                  const dayOfMonth = eventDate.getDate();
                  const weekOfMonth = Math.floor((dayOfMonth - 1) / 7);
                  const dayOffset = dayOfMonth % 7;
                  
                  return (
                    <HoverCard key={dateStr}>
                      <HoverCardTrigger asChild>
                        <button 
                          className="absolute w-9 h-9 z-10"
                          style={{
                            left: `${(dayOffset * 40) + 16}px`,
                            top: `${(weekOfMonth * 40) + 40}px`,
                            opacity: 0,
                          }}
                        />
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
                  classNames={{
                    day_selected: "bg-gold-500 text-primary-foreground hover:bg-gold-500 hover:text-primary-foreground focus:bg-gold-500 focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                  }}
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
                            <span>{format(parseISO(event.date), 'MMMM d, yyyy')}</span>
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