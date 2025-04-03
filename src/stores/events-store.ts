import { ApiError, api } from '@/utils/axiosConfig';
import { create } from 'zustand';

export type Event = {
  id: string;
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
  fetchEvents: () => Promise<Event[]>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<Event>;
  recordAttendance: (eventId: string, menCount: number, womenCount: number) => Promise<Event>;
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
      return data;
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch events';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
      return data;
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add event';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
      return data;
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update event';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
      throw new Error(errorMessage);
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
      return data;
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to toggle archive';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
      return data;
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || 'Failed to record attendance';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  getEventById: (id) => {
    return get().events.find(event => event.id === id);
  },

  getEventsByStatus: (archived) => {
    return get().events.filter(event => event.archived === archived);
  }
}));

// Initialize store (optional - can be called when needed)
useEventsStore.getState().fetchEvents();