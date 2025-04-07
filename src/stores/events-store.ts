import { ApiError, api } from '@/utils/axiosConfig';
import { create } from 'zustand';

export type Event = {
  id?: any;
  title: string;
  objectives: string;
  personnel: string;
  location: string;
  date: string;
  time: string;
  archived: boolean;
  eventType?: "REGULAR" | "SPECIAL";
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
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<Event>;
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
      try {
        const { data } = await api.get<Event[]>('/event/findAll');
        set({ events: data, loading: false });
      } catch (error) {
        console.error("API call failed, using mock data", error);
        const mockEvents = [
          {
            id: "1",
            title: "Youth Meeting",
            objectives: "Fellowship and Bible Study",
            personnel: "Pastor John",
            location: "Main Hall",
            date: "2025-04-10",
            time: "18:00",
            archived: false,
            eventType: "REGULAR" as const
          },
          {
            id: "2",
            title: "Easter Celebration",
            objectives: "Celebrate Easter",
            personnel: "Youth Committee",
            location: "Church Garden",
            date: "2025-04-21",
            time: "10:00",
            archived: false,
            eventType: "SPECIAL" as const
          }
        ];
        set({ events: mockEvents, loading: false });
      }
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to fetch events';
      set({ error: errorMessage, loading: false });
      console.error("Failed to fetch events:", errorMessage);
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
      throw error;
    }
  },

  updateEvent: async (id, updatedEvent) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
      loading: true
    }));

    try {
      const { data } = await api.patch<Event>(`/event/update/${id}`, updatedEvent);
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? data : event
        ),
        loading: false
      }));
      return data;
    } catch (error) {
      set(state => ({
        events: state.events,
        loading: false,
        error: (error as ApiError).message
      }));
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

export const initializeEventsStore = () => {
  console.log("Initializing events store");
  useEventsStore.getState().fetchEvents().catch(err => {
    console.error("Failed to initialize events store:", err);
  });
};

initializeEventsStore();
