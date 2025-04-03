import { api, ApiError } from '@/utils/axiosConfig';
import { create } from 'zustand';

export interface Announcement {
  id: string;
  details: string;
  createdAt: string;
  createdBy: string;
}

interface AnnouncementsStore {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  updateAnnouncement: (id: string, details: string) => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
}

export const useAnnouncementsStore = create<AnnouncementsStore>((set, get) => ({
  announcements: [],
  isLoading: false,
  error: null,

  fetchAnnouncements: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Announcement[]>('/announcements');
      set({ announcements: data, isLoading: false });
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to fetch announcements', set);
    }
  },

  addAnnouncement: async (announcement) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<Announcement>('/announcements', announcement);
      set(state => ({
        announcements: [...state.announcements, data],
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to add announcement', set);
    }
  },

  deleteAnnouncement: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/announcements/${id}`);
      set(state => ({
        announcements: state.announcements.filter(a => a.id !== id),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to delete announcement', set);
    }
  },

  updateAnnouncement: async (id, details) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch<Announcement>(`/announcements/${id}`, { details });
      set(state => ({
        announcements: state.announcements.map(a =>
          a.id === id ? data : a
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to update announcement', set);
    }
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<AnnouncementsStore>) => void
) {
  const errorMessage = error.response?.data?.message 
    || error.message 
    || defaultMessage;

  set({ 
    error: errorMessage,
    isLoading: false 
  });
  
  // Optional: Show toast notification
  console.error(`${defaultMessage}:`, error);
}

// Initialize store
useAnnouncementsStore.getState().fetchAnnouncements();