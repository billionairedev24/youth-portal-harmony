import { UserLayout } from "@/components/user-layout";
import { useState } from "react";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";
import { CalendarSection } from "@/components/dashboard/calendar-section";
import { EventsSection } from "@/components/dashboard/events-section";
import { PollsSection } from "@/components/dashboard/polls-section";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowSuggestionDialog(true)}
            size="lg"
            className="bg-gradient-to-r from-gold-400 to-gold-600 text-white hover:from-gold-500 hover:to-gold-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 rounded-full p-4"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
          <div className="xl:col-span-1 bg-gradient-to-br from-gold-50/50 to-gold-100/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
            <CalendarSection date={date} setDate={setDate} />
          </div>
          
          <div className="md:col-span-2 xl:col-span-2 bg-gradient-to-br from-gold-50/50 to-gold-100/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
            <EventsSection date={date} />
          </div>
          
          <div className="md:col-span-2 xl:col-span-3 bg-gradient-to-br from-gold-50/50 to-gold-100/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
            <PollsSection />
          </div>
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