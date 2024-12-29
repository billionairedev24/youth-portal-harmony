import { format, parseISO, subMonths, startOfMonth, eachMonthOfInterval } from "date-fns";
import { Event } from "@/stores/events-store";

export interface MonthlyAttendance {
  date: Date;
  month: string;
  men: number;
  women: number;
  total: number;
}

export function processAttendanceData(events: Event[]): MonthlyAttendance[] {
  const eventsWithAttendance = events.filter(event => event.attendance);
  
  if (eventsWithAttendance.length === 0) {
    return [];
  }

  const today = new Date();
  const last12Months = eachMonthOfInterval({
    start: startOfMonth(subMonths(today, 11)),
    end: startOfMonth(today)
  });

  const attendanceMap = eventsWithAttendance.reduce((acc, event) => {
    const monthKey = format(parseISO(event.date), 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = { men: 0, women: 0 };
    }
    acc[monthKey].men += event.attendance?.men || 0;
    acc[monthKey].women += event.attendance?.women || 0;
    return acc;
  }, {} as Record<string, { men: number; women: number }>);

  return last12Months.map(date => {
    const monthKey = format(date, 'yyyy-MM');
    const monthData = attendanceMap[monthKey] || { men: 0, women: 0 };
    
    return {
      date,
      month: format(date, 'MMM yyyy'),
      men: monthData.men,
      women: monthData.women,
      total: monthData.men + monthData.women,
    };
  });
}