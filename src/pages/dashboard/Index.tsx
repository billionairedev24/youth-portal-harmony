import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState, useEffect } from "react";
import { format, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { CalendarDays, Clock, MapPin, MessageSquarePlus, Users, ChevronLeft, ChevronRight } from "lucide-react";
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
import { UserPolls } from "@/components/user-polls";
import { DayClickEventHandler, DayProps } from "react-day-picker";
import { WeatherWidget } from "@/components/weather-widget";

const UserDashboard = () => {
  const { events } = useEventsStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [photos] = useState<Photo[]>([]); // In a real app, this would be fetched from your backend
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const activeEvents = events.filter(event => !event.archived);
  const selectedEvent = activeEvents.find(event => date && isSameDay(parseISO(event.date), date));

  const selectedDateEvents = activeEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return date ? isSameDay(eventDate, date) : isSameDay(eventDate, new Date());
  });

  const eventDates = activeEvents.reduce<Record<string, typeof activeEvents[number][]>>((acc, event) => {
    const eventDate = parseISO(event.date);
    const dateStr = format(eventDate, 'yyyy-MM-dd');
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(event);
    return acc;
  }, {});

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

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

  const renderDay = (props: DayProps) => {
    const { date: day, displayMonth } = props;
    if (!day) return null;
    
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEvents = eventDates[dateStr] || [];
    const isOutsideMonth = displayMonth && day.getMonth() !== displayMonth.getMonth();
    
    if (!dayEvents.length) {
      return <div className={`flex items-center justify-center w-full h-full ${isOutsideMonth ? "text-muted-foreground opacity-50" : ""}`}>
        {day.getDate()}
      </div>;
    }
    
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className={`flex items-center justify-center ${dayEvents.length > 0 ? 'animate-pulse-subtle font-bold text-gold-600' : ''} ${isOutsideMonth ? "text-muted-foreground opacity-50" : ""}`}>
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold-800 dark:text-gold-100">Welcome Back!</h1>
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            className="bg-gold-500 hover:bg-gold-600 text-white dark:bg-gold-600 dark:hover:bg-gold-700"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Create Suggestion
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-lg font-medium dark:text-gold-100">Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="h-8 w-8 p-0 hover:bg-gold-100 dark:hover:bg-gold-800/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-gold-100/50 text-gold-800 dark:bg-gold-800/50 dark:text-gold-100 dark:border-gold-700">
                  {format(currentMonth, 'MMMM yyyy')}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                  className="h-8 w-8 p-0 hover:bg-gold-100 dark:hover:bg-gold-800/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 relative z-10">
              <div className="relative flex justify-center">
                <TooltipProvider>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mx-auto dark:bg-gold-900/50 dark:border-gold-700 dark:text-gold-100"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    components={{
                      Day: (props) => renderDay(props),
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
        </div>

        {date && selectedEvent && (
          <WeatherWidget 
            date={date} 
            location={selectedEvent.location} 
          />
        )}

        {selectedEvent && (
          <UserPhotoViewer
            photos={photos}
            selectedEventId={selectedEvent.id}
          />
        )}

        <div>
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-medium dark:text-gold-100">Active Polls</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
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
