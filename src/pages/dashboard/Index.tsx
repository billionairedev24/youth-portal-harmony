import { UserLayout } from "@/components/user-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useEventsStore } from "@/stores/events-store";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarDays, Clock, MapPin, MessageSquarePlus, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserPolls } from "@/components/user-polls";
import { Button } from "@/components/ui/button";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";
import { cn } from "@/lib/utils";

const UserDashboard = () => {
  const { events } = useEventsStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  
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
      backgroundColor: 'rgba(234, 179, 8, 0.1)',
      color: '#FFB800',
      transform: 'scale(1.1)',
    }
  };

  const renderEventTooltip = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const event = eventDates[dateStr];
    
    if (!event) return null;

    return (
      <HoverCardContent className="w-80 bg-gradient-to-br from-gold-50 to-gold-100 border-gold-200">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gold-900">{event.title}</h4>
          <p className="text-sm text-gold-700">{event.objectives}</p>
          <div className="flex flex-col gap-2 text-sm text-gold-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-600" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-600" />
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gold-900 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-gold-500" />
            Your Dashboard
          </h1>
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            className="bg-gradient-to-r from-gold-400 to-gold-600 text-white hover:from-gold-500 hover:to-gold-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Share Your Ideas
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden bg-gradient-to-br from-gold-50/50 to-gold-100/30 border-gold-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gold-900 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gold-600" />
                Calendar
              </CardTitle>
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
                  className="rounded-xl border-gold-200/50"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  classNames={{
                    day_selected: "bg-gold-500 text-white hover:bg-gold-600 hover:text-white focus:bg-gold-500 focus:text-white",
                    day_today: "bg-gold-100 text-gold-900",
                    day: "hover:bg-gold-100 transition-all duration-200",
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden bg-gradient-to-br from-gold-50/50 to-gold-100/30 border-gold-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gold-900">
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
                        className={cn(
                          "p-4 rounded-xl space-y-2 transform transition-all duration-300",
                          "bg-gradient-to-br from-gold-100/50 to-gold-200/30",
                          "hover:shadow-md hover:-translate-y-0.5",
                          "border border-gold-200/50"
                        )}
                      >
                        <h3 className="font-semibold text-lg text-gold-900">{event.title}</h3>
                        <p className="text-sm text-gold-700">
                          {event.objectives}
                        </p>
                        <div className="flex flex-col gap-2 text-sm text-gold-800">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gold-600" />
                            <span>{format(parseISO(event.date), 'MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gold-600" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gold-600" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {(selectedDateEvents.length === 0 && activeEvents.length === 0) && (
                    <div className="text-center py-8">
                      <CalendarDays className="h-12 w-12 text-gold-400 mx-auto mb-3" />
                      <p className="text-gold-700 font-medium">No upcoming events</p>
                      <p className="text-sm text-gold-600">Check back later for new events!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden bg-gradient-to-br from-gold-50/50 to-gold-100/30 border-gold-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-gold-900">Active Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <UserPolls />
          </CardContent>
        </Card>

        <CreateSuggestionDialog
          open={showSuggestionDialog}
          onOpenChange={setShowSuggestionDialog}
        />
      </div>
    </UserLayout>
  );
};

export default UserDashboard;