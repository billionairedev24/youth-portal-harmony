
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, SendHorizonal, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";
import { CreateSuggestionDialog } from "@/components/create-suggestion-dialog";

export function SuggestionBox() {
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  
  return (
    <Card className="bg-gradient-to-br from-gold-50 to-gold-100/40 dark:from-gold-900/60 dark:to-gold-800/30 border-gold-200 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 dark:bg-gold-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-300/20 dark:bg-gold-700/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 z-0"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-medium flex items-center text-gold-800 dark:text-gold-100">
          <Lightbulb className="mr-2 h-5 w-5 text-gold-500" />
          Suggestion Box
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gold-100 dark:bg-gold-800 p-3 shadow-inner">
            <Sparkles className="h-6 w-6 text-gold-600 dark:text-gold-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gold-900 dark:text-gold-100 mb-1">Share Your Ideas</h3>
            <p className="text-xs text-gold-700 dark:text-gold-300">
              Have a suggestion for the youth group? We'd love to hear from you!
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 pt-0">
        <Button 
          onClick={() => setShowSuggestionDialog(true)}
          className="w-full bg-white hover:bg-gold-50 text-gold-800 hover:text-gold-900 border border-gold-200 dark:bg-gold-800 dark:hover:bg-gold-700 dark:text-gold-100 dark:border-gold-600 group"
        >
          <MessageSquare className="w-4 h-4 mr-2 text-gold-500 group-hover:text-gold-600 transition-colors" />
          <span>Submit Suggestion</span>
          <SendHorizonal className="w-4 h-4 ml-2 text-gold-500 group-hover:text-gold-600 transition-colors" />
        </Button>
      </CardFooter>
      
      <CreateSuggestionDialog
        open={showSuggestionDialog}
        onOpenChange={setShowSuggestionDialog}
      />
    </Card>
  );
}
