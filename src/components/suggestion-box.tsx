
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessageSquare } from "lucide-react";
import { useState } from "react";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";

export function SuggestionBox() {
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  
  return (
    <Card className="bg-gradient-to-br from-gold-50/80 to-gold-100/40 dark:from-gold-900/60 dark:to-gold-800/30 border-gold-200 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg font-medium flex items-center text-gold-800 dark:text-gold-100">
          <Lightbulb className="mr-2 h-5 w-5 text-gold-500" />
          Suggestions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gold-700 dark:text-gold-300 mr-4">
            Have a suggestion? We'd love to hear from you!
          </p>
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            size="sm"
            className="bg-white hover:bg-gold-50 text-gold-800 hover:text-gold-900 border border-gold-200 dark:bg-gold-800 dark:hover:bg-gold-700 dark:text-gold-100 dark:border-gold-600 group whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-gold-500 group-hover:text-gold-600 transition-colors" />
            <span>Submit</span>
          </Button>
        </div>
      </CardContent>
      
      <CreateSuggestionDialog
        open={showSuggestionDialog}
        onOpenChange={setShowSuggestionDialog}
      />
    </Card>
  );
}
