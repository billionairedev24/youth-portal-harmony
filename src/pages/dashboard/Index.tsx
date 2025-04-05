
import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState, useEffect } from "react";
import { format, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { CalendarDays, Clock, MapPin, MessageSquare, Users, ChevronLeft, ChevronRight, AlertCircle, Zap } from "lucide-react";
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
import { SuggestionBox } from "@/components/suggestion-box";

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
    return date ? isSameDay(eventDate, date) : false;
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
    
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className={`flex items-center justify-center w-9 h-9 ${dayEvents.length > 0 ? 'font-bold text-gold-600' : ''} ${isOutsideMonth ? "text-muted-foreground opacity-50" : ""}`}>
                {day.getDate()}
              </div>
              {dayEvents.length > 1 && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-gold-600 rounded-full" />
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Calendar Card */}
          <Card className="md:col-span-1 lg:col-span-1 dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-lg font-medium dark:text-gold-100 flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-gold-500" />
                Calendar
              </CardTitle>
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

          {/* Upcoming Events Card */}
          <Card className="md:col-span-1 lg:col-span-1 dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-medium dark:text-gold-100 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gold-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <ScrollArea className="h-[280px] pr-4">
                {activeEvents.length > 0 ? (
                  <div className="space-y-3">
                    {activeEvents.map((event) => {
                      const eventDate = parseISO(event.date);
                      const isToday = isSameDay(eventDate, new Date());
                      const isSelected = date && isSameDay(eventDate, date);
                      
                      return (
                        <div 
                          key={event.id}
                          className={`p-3 rounded-lg border dark:border-gold-700 transition-all cursor-pointer 
                            ${isSelected ? 'bg-gold-100 dark:bg-gold-800/60 border-gold-300 dark:border-gold-600' : 
                              'bg-white/60 hover:bg-gold-50 dark:bg-gold-900/40 dark:hover:bg-gold-800/30'}
                            ${isToday ? 'ring-2 ring-gold-400 dark:ring-gold-600' : ''}
                          `}
                          onClick={() => setDate(eventDate)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{event.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${isToday ? 'bg-gold-100 text-gold-800 border-gold-300' : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'}`}
                            >
                              {isToday ? 'Today' : format(eventDate, 'MMM d')}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {event.objectives}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gold-500" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gold-500" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-gold-500" />
                              <span>{event.personnel.split(',')[0]}{event.personnel.includes(',') && '...'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <AlertCircle className="h-10 w-10 text-gold-400 mb-2" />
                    <h3 className="text-lg font-medium text-gold-600 mb-1">No Events Found</h3>
                    <p className="text-sm text-muted-foreground">
                      There are no upcoming events scheduled at this time.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className="md:col-span-1 lg:col-span-1 dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg font-medium dark:text-gold-100">
                {date && selectedEvent ? (
                  <span className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-gold-500" />
                    Weather for {selectedEvent.location}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-gold-500" />
                    Local Weather
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              {date ? (
                <WeatherWidget 
                  date={date} 
                  location={selectedEvent?.location || "Local"}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                  <div className="text-muted-foreground mb-2">Select a date to see weather information</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Suggestion Box */}
        <SuggestionBox />
        
        {selectedEvent && (
          <UserPhotoViewer
            photos={photos}
            selectedEventId={selectedEvent.id}
          />
        )}

        <div>
          <Card className="dark:bg-gold-900/50 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold-100/30 dark:to-gold-900/30 pointer-events-none rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-medium dark:text-gold-100 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-gold-500" />
                Active Polls
              </CardTitle>
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
