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
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  updateAnnouncement: (id: string, details: string) => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
}

export const useAnnouncementsStore = create<AnnouncementsStore>((set, get) => ({
  announcements: [],
  isLoading: false,
  addAnnouncement: async (announcement) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAnnouncement = {
      ...announcement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      announcements: [...state.announcements, newAnnouncement],
      isLoading: false
    }));
  },
  deleteAnnouncement: async (id) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set(state => ({
      announcements: state.announcements.filter(a => a.id !== id),
      isLoading: false
    }));
  },
  updateAnnouncement: async (id, details) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set(state => ({
      announcements: state.announcements.map(a =>
        a.id === id ? { ...a, details } : a
      ),
      isLoading: false
    }));
  },
  fetchAnnouncements: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ announcements: [], isLoading: false });
  },
}));