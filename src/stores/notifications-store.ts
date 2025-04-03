import { create } from "zustand";
import { api, ApiError } from "@/utils/axiosConfig";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Notification[]>("/notifications");
      set({ 
        notifications: data.map(notif => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        })), 
        isLoading: false 
      });
    } catch (error) {
      handleApiError(error as ApiError, "Failed to fetch notifications", set);
    }
  },

  addNotification: async (notification) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<Notification>("/notifications", {
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
      });
      set(state => ({
        notifications: [data, ...state.notifications],
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to add notification", set);
    }
  },

  markAsRead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch<Notification>(`/notifications/${id}/read`, { read: true });
      set(state => ({
        notifications: state.notifications.map(notification =>
          notification.id === id ? data : notification
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to mark notification as read", set);
    }
  },

  markAllAsRead: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.patch("/notifications/mark-all-read");
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to mark all notifications as read", set);
    }
  },

  deleteNotification: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/notifications/${id}`);
      set(state => ({
        notifications: state.notifications.filter(notification => notification.id !== id),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to delete notification", set);
    }
  },

  unreadCount: () => {
    return get().notifications.filter(notification => !notification.read).length;
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<NotificationsStore>) => void
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
useNotificationsStore.getState().fetchNotifications();