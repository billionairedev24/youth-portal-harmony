import { ApiError, api } from '@/utils/axiosConfig';
import { create } from 'zustand';

type Event = {
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
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  recordAttendance: (eventId: string, menCount: number, womenCount: number) => Promise<void>;
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
      handleApiError(error as ApiError, 'Failed to fetch events', set);
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
      handleApiError(error as ApiError, 'Failed to add event', set);
    }
  },

  updateEvent: async (id, updatedEvent) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.patch<Event>(`/event/update/${id}`, updatedEvent);
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? data : event
        ),
        loading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to update event', set);
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
      handleApiError(error as ApiError, 'Failed to delete event', set);
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
      handleApiError(error as ApiError, 'Failed to toggle archive', set);
    }
  },

  recordAttendance: async (eventId, menCount, womenCount) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<Event>(`/${eventId}/attendance`, {
        men: menCount,
        women: womenCount
      });

      set(state => ({
        events: state.events.map(event => 
          event.id === eventId ? data : event
        ),
        loading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, 'Failed to record attendance', set);
    }
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<EventsStore>) => void
) {
  const errorMessage = error.response?.data?.message 
    || error.message 
    || defaultMessage;

  set({ 
    error: errorMessage,
    loading: false 
  });
  
  // Optional: Show toast notification
  console.error(`${defaultMessage}:`, error);
}

// Initialize store
useEventsStore.getState().fetchEvents();