
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Cake } from "lucide-react";
import { Member } from "@/stores/members-store";

interface BirthdayCardProps {
  member: Member;
}

export function BirthdayCard({ member }: BirthdayCardProps) {
  const birthdayDate = new Date(member.birthday);
  const day = birthdayDate.getDate();
  const isToday = day === new Date().getDate() && 
                 birthdayDate.getMonth() === new Date().getMonth();
  
  return (
    <div className={`flex items-center p-3 group-hover:bg-gold-50/80 dark:group-hover:bg-gold-800/20 rounded-lg transition-all ${isToday ? 'ring-2 ring-gold-300 dark:ring-gold-600 bg-gold-50/50 dark:bg-gold-800/30' : ''}`}>
      <Avatar className="h-12 w-12 border-2 border-gold-100 dark:border-gold-800 shadow-sm group-hover:scale-105 transition-transform">
        <AvatarImage 
          src={member.image} 
          alt={`${member.firstName} ${member.lastName}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-gold-100 text-gold-800 dark:bg-gold-800 dark:text-gold-100">
          {member.firstName[0]}{member.lastName[0]}
        </AvatarFallback>
      </Avatar>
      
      <div className="ml-3 flex-1">
        <p className="font-medium text-sm text-gold-900 dark:text-gold-100">
          {member.firstName} {member.lastName}
        </p>
        <div className="flex items-center mt-1">
          <Cake className="w-3 h-3 text-gold-500 mr-1" />
          <p className="text-xs text-gold-600 dark:text-gold-400">
            {format(birthdayDate, 'MMMM do')}
            {isToday && <span className="ml-1 text-gold-500 font-medium">(Today!)</span>}
          </p>
        </div>
      </div>
      
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${isToday ? 'bg-gold-300 text-gold-900 dark:bg-gold-500 dark:text-gold-100 shadow-md' : 'bg-gold-100 dark:bg-gold-800 text-gold-800 dark:text-gold-200 shadow-sm'}`}>
        {day}
      </div>
    </div>
  );
}
