
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
          Share Your Ideas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gold-700 dark:text-gold-300">
            Help us improve our community by sharing your suggestions, feedback, or ideas.
          </p>
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            size="sm"
            className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white shadow group"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-white/80 group-hover:text-white transition-colors" />
            <span>Submit Suggestion</span>
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
