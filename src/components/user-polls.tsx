import { useState } from "react";
import { usePollsStore } from "@/stores/polls-store";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { VoteIcon } from "lucide-react";

export function UserPolls() {
  const { polls, vote } = usePollsStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [editingPollId, setEditingPollId] = useState<string | null>(null);

  const activePollsExist = polls.some((poll) => poll.status === "active");

  const handleVote = (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) {
      toast.error("Please select an option before voting");
      return;
    }

    const userId = "user-1"; 
    
    const poll = polls.find(p => p.id === pollId);
    if (poll?.votes.some(v => v.userId === userId) && !editingPollId) {
      toast.error("You have already voted in this poll");
      return;
    }

    vote(pollId, userId, selectedOption);
    toast.success(editingPollId ? "Vote updated successfully!" : "Vote submitted successfully!");
    
    setEditingPollId(null);
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: ""
    }));
  };

  const calculateResults = (poll: any) => {
    const totalVotes = poll.votes.length;
    const results = poll.options.map((option: string) => {
      const optionVotes = poll.votes.filter((vote: any) => vote.option === option).length;
      const percentage = totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;
      return {
        option,
        votes: optionVotes,
        percentage: Math.round(percentage)
      };
    });
    return { results, totalVotes };
  };

  const hasUserVoted = (poll: any) => {
    const userId = "user-1";
    return poll.votes.some((vote: any) => vote.userId === userId);
  };

  const getUserVote = (poll: any) => {
    const userId = "user-1";
    const userVote = poll.votes.find((vote: any) => vote.userId === userId);
    return userVote?.option || "";
  };

  const handleEditVote = (pollId: string) => {
    const userVote = getUserVote(polls.find(p => p.id === pollId));
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: userVote
    }));
    setEditingPollId(pollId);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <VoteIcon className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No Active Polls</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        There are no active polls at the moment. Check back later for new polls to participate in.
      </p>
    </div>
  );

  if (!activePollsExist) {
    return <EmptyState />;
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
              
              {hasUserVoted(poll) && editingPollId !== poll.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-green-600">
                      Thank you for participating! Your vote has been recorded.
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVote(poll.id)}
                    >
                      Change Vote
                    </Button>
                  </div>
                  <div className="text-sm font-medium">Current Results:</div>
                  {calculateResults(poll).results.map((result: any) => (
                    <div key={result.option} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{result.option}</span>
                        <span>{result.percentage}% ({result.votes} votes)</span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                  ))}
                  <div className="text-sm text-muted-foreground text-center mt-4">
                    Total votes: {calculateResults(poll).totalVotes}
                  </div>
                </div>
              ) : (
                <>
                  {editingPollId === poll.id && (
                    <div className="text-sm text-amber-600 mb-4">
                      You're changing your previous vote. Select a new option and submit to update your vote.
                    </div>
                  )}
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
                    {editingPollId === poll.id ? "Update Vote" : "Submit Vote"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
