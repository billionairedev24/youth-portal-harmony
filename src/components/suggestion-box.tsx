
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessageSquare } from "lucide-react";
import { useState } from "react";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";

export function SuggestionBox() {
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  
  return (
    <Card className="bg-gradient-to-br from-gold-50/80 to-gold-100/40 dark:from-gold-900/60 dark:to-gold-800/30 border-gold-200 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 h-full">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-200/20 dark:bg-gold-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gold-300/20 dark:bg-gold-700/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 z-0"></div>
      
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg font-medium flex items-center text-gold-800 dark:text-gold-100">
          <Lightbulb className="mr-2 h-5 w-5 text-gold-500" />
          Share Your Ideas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gold-700 dark:text-gold-300">
            Have ideas or feedback? We'd love to hear from you!
          </p>
          <Button 
            onClick={() => setShowSuggestionDialog(true)}
            size="sm"
            className="w-full shadow-sm hover:shadow-md bg-gradient-to-r from-gold-300 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-gold-900 group transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-gold-700 group-hover:text-gold-800 transition-colors" />
            <span>Submit a Suggestion</span>
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
