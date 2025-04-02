
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PopoverCalendarProps {
  children: React.ReactNode;
  date: Date;
  onSelect: (date: Date) => void;
}

export function PopoverCalendar({ children, date, onSelect }: PopoverCalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && onSelect(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
