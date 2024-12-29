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
  addPoll: (poll: Poll) => void;
  updatePoll: (id: string, updates: Partial<Poll>) => Promise<void>;
  deletePoll: (id: string) => void;
  vote: (pollId: string, userId: string, option: string) => void;
}

// Mock API call
const mockUpdatePoll = async (id: string, updates: Partial<Poll>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

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
      polls: [...state.polls, poll],
    })),
  updatePoll: async (id, updates) => {
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === id ? { ...poll, ...updates } : poll
      ),
    }));
    try {
      await mockUpdatePoll(id, updates);
    } catch (error) {
      console.error('Failed to update poll:', error);
      set((state) => ({
        polls: state.polls.map((poll) =>
          poll.id === id ? { ...poll } : poll
        ),
      }));
    }
  },
  deletePoll: (id) =>
    set((state) => ({
      polls: state.polls.filter((poll) => poll.id !== id),
    })),
  vote: (pollId, userId, option) =>
    set((state) => ({
      polls: state.polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              votes: [
                ...poll.votes.filter((vote) => vote.userId !== userId),
                { userId, option }
              ],
            }
          : poll
      ),
    })),
}));