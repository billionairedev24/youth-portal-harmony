
import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarDays, Clock, MapPin, MessageSquarePlus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";
import { UserPhotoViewer } from "@/components/photos/user-photo-viewer";
import { Photo } from "@/components/photos/types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const UserDashboard = () => {
  const { events } = useEventsStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [photos] = useState<Photo[]>([]); // In a real app, this would be fetched from your backend
  
  const activeEvents = events.filter(event => !event.archived);
  const selectedEvent = activeEvents.find(event => date && isSameDay(parseISO(event.date), date));

  const selectedDateEvents = activeEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return date ? isSameDay(eventDate, date) : isSameDay(eventDate, new Date());
  });

  // Build an object mapping each date to event data
  const eventDates = activeEvents.reduce<Record<string, typeof activeEvents[number][]>>((acc, event) => {
    const eventDate = parseISO(event.date);
    const dateStr = format(eventDate, 'yyyy-MM-dd');
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(event);
    return acc;
  }, {});

  // Prepare data for the calendar modifiers
  const modifiers = {
    hasEvent: (day: Date) => {
      return format(day, 'yyyy-MM-dd') in eventDates;
    }
  };

  const modifiersStyles = {
    hasEvent: {
      color: "var(--gold-600)",
      fontWeight: 'bold',
      backgroundColor: 'rgba(234, 179, 8, 0.2)', 
      borderRadius: '100%'
    }
  };

  // Custom day renderer for the calendar
  const renderDay = (day: Date, activeModifiers: Record<string, boolean>) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEvents = eventDates[dateStr] || [];
    
    if (!dayEvents.length) {
      return <div>{day.getDate()}</div>;
    }
    
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className={`flex items-center justify-center ${dayEvents.length > 0 ? 'animate-pulse-subtle' : ''}`}>
                {day.getDate()}
              </div>
              {dayEvents.length > 1 && (
                <span className="absolute -bottom-1 right-0 w-2 h-2 bg-gold-600 rounded-full" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="p-0 bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900 dark:to-gold-800 border-gold-200 dark:border-gold-700"
            side="right"
          >
            <div className="p-3 max-w-xs">
              <h4 className="text-sm font-semibold mb-2 text-gold-900 dark:text-gold-100">
                {dayEvents.length === 1 
                  ? dayEvents[0].title 
                  : `${dayEvents.length} Events on ${format(day, 'MMMM d')}`
                }
              </h4>
              {dayEvents.length === 1 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gold-700 dark:text-gold-300">
                    {dayEvents[0].objectives}
                  </p>
                  <div className="flex text-xs items-center gap-1 text-gold-600 dark:text-gold-400">
                    <Clock className="h-3 w-3" />
                    <span>{dayEvents[0].time}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div key={i} className="flex items-center text-xs gap-1 text-gold-700 dark:text-gold-300">
                      <span>•</span>
                      <span>{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gold-500 dark:text-gold-400 italic">
                      +{dayEvents.length - 3} more...
                    </div>
                  )}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            className="bg-gold-500 hover:bg-gold-600 text-white dark:bg-gold-600 dark:hover:bg-gold-700"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Create Suggestion
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium dark:text-gold-100">Calendar</CardTitle>
              {date && (
                <Badge variant="outline" className="bg-gold-100/50 text-gold-800 dark:bg-gold-800/50 dark:text-gold-100 dark:border-gold-700">
                  {format(date, 'MMMM yyyy')}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative flex justify-center">
                <TooltipProvider>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mx-auto dark:bg-gold-900/50 dark:border-gold-700 dark:text-gold-100"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    components={{
                      Day: ({ date: dayDate, activeModifiers }) => renderDay(dayDate, activeModifiers),
                    }}
                    classNames={{
                      day_selected: "bg-gold-500 text-primary-foreground hover:bg-gold-500 hover:text-primary-foreground focus:bg-gold-500 focus:text-primary-foreground dark:bg-gold-600",
                      day_today: "bg-accent text-accent-foreground dark:bg-gold-800 dark:text-gold-100",
                    }}
                  />
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium dark:text-gold-100">
                {selectedDateEvents.length > 0 
                  ? `Events on ${format(date || new Date(), 'MMMM d, yyyy')}`
                  : "Upcoming Events"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {(selectedDateEvents.length > 0 ? selectedDateEvents : activeEvents)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg bg-gold-50/80 dark:bg-gold-800/40 space-y-2 border border-gold-200/50 dark:border-gold-700/50 transition-all hover:shadow-md"
                      >
                        <h3 className="font-semibold text-lg dark:text-gold-100">{event.title}</h3>
                        <p className="text-sm text-gold-700 dark:text-gold-400">
                          {event.objectives}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(parseISO(event.date), 'MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gold-600 dark:text-gold-300">
                            <Users className="h-4 w-4" />
                            <span>{event.personnel}</span>
                          </div>
                          {event.attendance && (
                            <div className="flex items-center mt-2 gap-2">
                              <Badge className="bg-gold-500/80 hover:bg-gold-500 dark:bg-gold-700/80 dark:hover:bg-gold-700">
                                {event.attendance.men + event.attendance.women} Attended
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {(selectedDateEvents.length === 0 && activeEvents.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-40 gap-3">
                      <CalendarDays className="h-12 w-12 text-gold-300 dark:text-gold-700" />
                      <p className="text-gold-500 dark:text-gold-400 text-center">
                        No upcoming events
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {selectedEvent && (
          <UserPhotoViewer
            photos={photos}
            selectedEventId={selectedEvent.id}
          />
        )}

        <div>
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium dark:text-gold-100">Active Polls</CardTitle>
            </CardHeader>
            <CardContent>
              <UserPolls />
            </CardContent>
          </Card>
        </div>

        <CreateSuggestionDialog
          open={showSuggestionDialog}
          onOpenChange={setShowSuggestionDialog}
        />
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
