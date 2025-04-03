import { create } from "zustand";
import { api, ApiError } from "@/utils/axiosConfig";

export type NotificationPreference = "sms" | "whatsapp" | "email";
export type Role = "admin" | "member";

export interface Member {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
  notificationPreference: NotificationPreference;
  role: Role;
}

interface MembersStore {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  toggleRole: (id: string) => Promise<void>;
}

export const useMembersStore = create<MembersStore>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Member[]>("/members");
      set({ members: data, isLoading: false });
    } catch (error) {
      handleApiError(error as ApiError, "Failed to fetch members", set);
    }
  },

  updateMember: async (id, updatedMember) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch<Member>(`/members/${id}`, updatedMember);
      set(state => ({
        members: state.members.map(member => 
          member.id === id ? data : member
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to update member", set);
    }
  },

  deleteMember: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/members/${id}`);
      set(state => ({
        members: state.members.filter(member => member.id !== id),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to delete member", set);
    }
  },

  toggleRole: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const member = get().members.find(m => m.id === id);
      if (!member) throw new Error("Member not found");

      const newRole: Role = member.role === "admin" ? "member" : "admin";
      const { data } = await api.patch<Member>(`/members/${id}/role`, { role: newRole });
      
      set(state => ({
        members: state.members.map(member => 
          member.id === id ? data : member
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to toggle role", set);
    }
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<MembersStore>) => void
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
useMembersStore.getState().fetchMembers();