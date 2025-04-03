import { create } from "zustand";
import { api, ApiError } from "@/utils/axiosConfig";

export type PollStatus = "draft" | "active" | "closed";

export interface PollVote {
  userId: string;
  option: string;
  timestamp?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: PollStatus;
  options: string[];
  votes: PollVote[];
  createdAt?: string;
  updatedAt?: string;
}

interface PollsStore {
  polls: Poll[];
  isLoading: boolean;
  error: string | null;
  fetchPolls: () => Promise<void>;
  getPollById: (id: string) => Poll | undefined;
  addPoll: (poll: Omit<Poll, "id" | "votes" | "status">) => Promise<void>;
  updatePoll: (id: string, updates: Partial<Poll>) => Promise<void>;
  deletePoll: (id: string) => Promise<void>;
  vote: (pollId: string, userId: string, option: string) => Promise<void>;
  changePollStatus: (id: string, status: PollStatus) => Promise<void>;
  hasVoted: (pollId: string, userId: string) => boolean;
}

export const usePollsStore = create<PollsStore>((set, get) => ({
  polls: [],
  isLoading: false,
  error: null,

  fetchPolls: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Poll[]>("/polls");
      set({ polls: data, isLoading: false });
    } catch (error) {
      handleApiError(error as ApiError, "Failed to fetch polls", set);
    }
  },

  getPollById: (id) => {
    return get().polls.find(poll => poll.id === id);
  },

  addPoll: async (poll) => {
    set({ isLoading: true, error: null });
    try {
      const newPoll = {
        ...poll,
        status: "draft" as const,
        votes: []
      };
      const { data } = await api.post<Poll>("/polls", newPoll);
      set(state => ({
        polls: [...state.polls, data],
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to create poll", set);
    }
  },

  updatePoll: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch<Poll>(`/polls/${id}`, updates);
      set(state => ({
        polls: state.polls.map(poll => 
          poll.id === id ? data : poll
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to update poll", set);
      throw error; // Re-throw for component-level handling
    }
  },

  deletePoll: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/polls/${id}`);
      set(state => ({
        polls: state.polls.filter(poll => poll.id !== id),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to delete poll", set);
    }
  },

  vote: async (pollId, userId, option) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<Poll>(`/polls/${pollId}/vote`, { 
        userId, 
        option 
      });
      set(state => ({
        polls: state.polls.map(poll => 
          poll.id === pollId ? data : poll
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to submit vote", set);
    }
  },

  changePollStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch<Poll>(`/polls/${id}/status`, { status });
      set(state => ({
        polls: state.polls.map(poll => 
          poll.id === id ? data : poll
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to change poll status", set);
    }
  },

  hasVoted: (pollId, userId) => {
    const poll = get().polls.find(p => p.id === pollId);
    return poll ? poll.votes.some(vote => vote.userId === userId) : false;
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<PollsStore>) => void
) {
  const errorMessage = error.response?.data?.message 
    || error.message 
    || defaultMessage;

  set({ 
    error: errorMessage,
    isLoading: false 
  });
  
  console.error(`${defaultMessage}:`, error);
}

// Initialize store
usePollsStore.getState().fetchPolls();