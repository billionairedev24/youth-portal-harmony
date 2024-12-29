import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useEventsStore } from "@/stores/events-store";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";

interface CalendarSectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function CalendarSection({ date, setDate }: CalendarSectionProps) {
  const { events } = useEventsStore();
  const activeEvents = events.filter(event => !event.archived);

  const eventDates = activeEvents.reduce((acc, event) => {
    const eventDate = parseISO(event.date);
    acc[format(eventDate, 'yyyy-MM-dd')] = event;
    return acc;
  }, {} as Record<string, typeof activeEvents[0]>);

  const modifiers = {
    hasEvent: (date: Date) => format(date, 'yyyy-MM-dd') in eventDates
  };

  const modifiersStyles = {
    hasEvent: {
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0.2) 100%)',
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
  );
}