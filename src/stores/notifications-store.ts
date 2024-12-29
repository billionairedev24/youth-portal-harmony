import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [
    {
      id: "1",
      title: "New Event Created",
      message: "A new event has been created for next week",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Poll Results",
      message: "The latest poll results are now available",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
}));