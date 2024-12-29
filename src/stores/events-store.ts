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
};

type EventsStore = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  toggleArchive: (id: string) => void;
};

export const useEventsStore = create<EventsStore>((set) => ({
  events: [
    {
      id: "1",
      title: "Youth Sunday Service",
      objectives: "Weekly worship and fellowship",
      personnel: "Pastor John, Youth Leaders",
      location: "Main Hall",
      date: "2024-03-10",
      time: "10:00 AM",
      archived: false,
    },
    {
      id: "2",
      title: "Bible Study",
      objectives: "Deep dive into Scripture",
      personnel: "Sarah Smith",
      location: "Room 101",
      date: "2024-03-12",
      time: "7:00 PM",
      archived: false,
    },
  ],
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  toggleArchive: (id) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, archived: !event.archived } : event
      ),
    })),
}));