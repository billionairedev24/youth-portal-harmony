
import { useMembersStore } from "@/stores/members-store";
import { BirthdayCard } from "./birthday-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cake, Gift, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { format, isSameMonth, parseISO } from "date-fns";

export function MonthlyBirthdays() {
  const { members } = useMembersStore();
  const [currentMonth] = useState(new Date());
  
  // Filter members with birthdays in the current month
  const birthdaysThisMonth = members.filter(member => {
    const birthday = new Date(member.birthday);
    return isSameMonth(birthday, currentMonth);
  }).sort((a, b) => {
    const dayA = new Date(a.birthday).getDate();
    const dayB = new Date(b.birthday).getDate();
    return dayA - dayB;
  });
  
  return (
    <Card className="bg-gradient-to-br from-gold-50/80 to-gold-100/40 dark:from-gold-900/60 dark:to-gold-800/30 border-gold-200 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 dark:bg-gold-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-300/20 dark:bg-gold-700/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 z-0"></div>
      
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg font-medium flex items-center text-gold-800 dark:text-gold-100">
          <Cake className="mr-2 h-5 w-5 text-gold-500" />
          {format(currentMonth, 'MMMM')} Birthdays
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        {birthdaysThisMonth.length > 0 ? (
          <ScrollArea className="h-[220px] pr-4">
            <div className="space-y-2">
              {birthdaysThisMonth.map((member) => (
                <BirthdayCard key={member.id} member={member} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[180px] text-center p-4">
            <Gift className="h-10 w-10 text-gold-400 mb-2" />
            <h3 className="text-lg font-medium text-gold-600 mb-1">No Birthdays This Month</h3>
            <p className="text-sm text-muted-foreground">
              There are no birthdays to celebrate this month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
