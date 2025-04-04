import { ApiError, api } from '@/utils/axiosConfig';
import { create } from 'zustand';

export type Event = {
  id?: string; // Changed from 'any' to 'string' for type safety
  title: string;
  objectives: string;
  personnel: string;
  location: string;
  date: string;
  time: string;
  archived: boolean;
  attendance?: {
    men: number;
    women: number;
    date: string;
  };
};

type EventsStore = {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  recordAttendance: (eventId: string, menCount: number, womenCount: number) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  getEventsByStatus: (archived: boolean) => Event[];
};

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<Event[]>('/event/findAll');
      set({ events: data, loading: false });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch events';
      set({ error: errorMessage, loading: false });
      throw error; // Re-throw to allow component to handle
    }
  },

  addEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<Event>('/event/create', event);
      set(state => ({
        events: [...state.events, data],
        loading: false
      }));
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add event';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateEvent: async (id, updatedEvent) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.patch<Event>(`/event/update/${id}`, updatedEvent);
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? { ...event, ...data } : event
        ),
        loading: false
      }));
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update event';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/event/delete/${id}`);
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        loading: false
      }));
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete event';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  toggleArchive: async (id) => {
    set({ loading: true, error: null });
    try {
      const event = get().events.find(e => e.id === id);
      if (!event) throw new Error('Event not found');

      const { data } = await api.patch<Event>(`/event/${id}/archive`, {
        archived: !event.archived
      });

      set(state => ({
        events: state.events.map(event => 
          event.id === id ? data : event
        ),
        loading: false
      }));
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to toggle archive';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  recordAttendance: async (eventId, menCount, womenCount) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<Event>(`/event/${eventId}/attendance`, {
        men: menCount,
        women: womenCount,
        date: new Date().toISOString()
      });

      set(state => ({
        events: state.events.map(event => 
          event.id === eventId ? data : event
        ),
        loading: false
      }));
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to record attendance';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  getEventById: (id) => {
    return get().events.find(event => event.id === id);
  },

  getEventsByStatus: (archived) => {
    return get().events.filter(event => event.archived === archived);
  }
}));

// Optional: Export a function to initialize the store when needed
export const initializeEventsStore = () => {
  useEventsStore.getState().fetchEvents();
};

initializeEventsStore();