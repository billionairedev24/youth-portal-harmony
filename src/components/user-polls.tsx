import { useState } from "react";
import { usePollsStore } from "@/stores/polls-store";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { PollDetailsDialog } from "./poll-details-dialog";

export function UserPolls() {
  const { polls, vote } = usePollsStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const activePollsExist = polls.some((poll) => poll.status === "active");

  const handleVote = (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) {
      toast.error("Please select an option before voting");
      return;
    }

    // In a real app, you'd get the actual user ID from auth
    const userId = "user-1"; 
    
    // Check if user has already voted
    const poll = polls.find(p => p.id === pollId);
    if (poll?.votes.some(v => v.userId === userId)) {
      toast.error("You have already voted in this poll");
      return;
    }

    vote(pollId, userId, selectedOption);
    toast.success("Vote submitted successfully!");
    
    // Clear the selection
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: ""
    }));

    // Show results dialog
    setSelectedPollId(pollId);
    setShowResults(true);
  };

  if (!activePollsExist) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No active polls at the moment
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {polls
        .filter((poll) => poll.status === "active")
        .map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{poll.title}</CardTitle>
                <Badge
                  className={
                    poll.status === "active"
                      ? "bg-green-500"
                      : poll.status === "closed"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }
                >
                  {poll.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {poll.startDate} - {poll.endDate}
              </div>
              <RadioGroup
                value={selectedOptions[poll.id]}
                onValueChange={(value) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [poll.id]: value,
                  }))
                }
                className="space-y-2"
              >
                {poll.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${poll.id}-${option}`} />
                    <Label htmlFor={`${poll.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button
                onClick={() => handleVote(poll.id)}
                className="w-full"
              >
                Submit Vote
              </Button>
            </CardContent>
          </Card>
        ))}

      <PollDetailsDialog
        pollId={selectedPollId}
        open={showResults}
        onOpenChange={setShowResults}
      />
    </div>
  );
}