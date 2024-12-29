import { create } from "zustand";

export interface Poll {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "closed";
  options: string[];
  votes: {
    userId: string;
    option: string;
  }[];
}

interface PollsStore {
  polls: Poll[];
  addPoll: (poll: Omit<Poll, "id" | "votes">) => void;
  updatePoll: (id: string, updates: Partial<Poll>) => void;
  vote: (pollId: string, userId: string, option: string) => void;
}

export const usePollsStore = create<PollsStore>((set) => ({
  polls: [
    {
      id: "1",
      title: "Next Event Theme",
      startDate: "2024-03-20",
      endDate: "2024-04-20",
      status: "active",
      options: ["Worship Night", "Game Night", "Movie Night"],
      votes: [
        { userId: "1", option: "Worship Night" },
        { userId: "2", option: "Game Night" },
      ],
    },
  ],
  addPoll: (poll) =>
    set((state) => ({
      polls: [
        ...state.polls,
        { ...poll, id: Math.random().toString(), votes: [] },
      ],
    })),
  updatePoll: (id, updates) =>
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === id ? { ...poll, ...updates } : poll
      ),
    })),
  vote: (pollId, userId, option) =>
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              votes: [
                // Remove any existing vote by this user
                ...poll.votes.filter((vote) => vote.userId !== userId),
                // Add the new/updated vote
                { userId, option }
              ],
            }
          : poll
      ),
    })),
}));