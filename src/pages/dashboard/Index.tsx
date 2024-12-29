import { UserLayout } from "@/components/user-layout";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import { useState } from "react";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";
import { CalendarSection } from "@/components/dashboard/calendar-section";
import { EventsSection } from "@/components/dashboard/events-section";
import { PollsSection } from "@/components/dashboard/polls-section";

const UserDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);

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

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-1">
            <CalendarSection date={date} setDate={setDate} />
          </div>
          <div className="lg:col-span-1 xl:col-span-2">
            <EventsSection date={date} />
          </div>
        </div>

        <div className="grid gap-6">
          <PollsSection />
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