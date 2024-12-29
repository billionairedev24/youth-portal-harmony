import { ScrollArea } from "@/components/ui/scroll-area";
import { useEventsStore } from "@/stores/events-store";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface EventsSectionProps {
  date: Date | undefined;
}

export function EventsSection({ date }: EventsSectionProps) {
  const { events } = useEventsStore();
  const activeEvents = events.filter(event => !event.archived);

  const selectedDateEvents = activeEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return date ? isSameDay(eventDate, date) : isSameDay(eventDate, new Date());
  });

  const displayEvents = selectedDateEvents.length > 0 ? selectedDateEvents : activeEvents;

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {displayEvents.map((event) => (
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
            <div className="flex flex-col gap-2 text-sm text-gold-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gold-600" />
                <span>{format(parseISO(event.date), 'MMM d')}</span>
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
        {displayEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <CalendarDays className="h-12 w-12 text-gold-400 animate-pulse" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}