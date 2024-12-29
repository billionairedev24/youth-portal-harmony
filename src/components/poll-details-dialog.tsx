import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePollsStore } from "@/stores/polls-store";
import { Badge } from "./ui/badge";

interface PollDetailsDialogProps {
  pollId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PollDetailsDialog({
  pollId,
  open,
  onOpenChange,
}: PollDetailsDialogProps) {
  const { polls } = usePollsStore();
  const poll = polls.find((p) => p.id === pollId);

  if (!poll) return null;

  const getVoteCount = (option: string) =>
    poll.votes.filter((vote) => vote.option === option).length;

  const totalVotes = poll.votes.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{poll.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Status</p>
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
          <div>
            <p className="text-sm font-medium">Date Range</p>
            <p className="text-sm text-muted-foreground">
              {poll.startDate} - {poll.endDate}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Results</p>
            <div className="space-y-2">
              {poll.options.map((option) => {
                const votes = getVoteCount(option);
                const percentage = totalVotes ? (votes / totalVotes) * 100 : 0;
                return (
                  <div key={option} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option}</span>
                      <span>{votes} votes</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-gold-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Total votes: {totalVotes}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}