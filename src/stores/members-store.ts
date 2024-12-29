import { create } from "zustand";

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
  notificationPreference: NotificationPreference;
  role: Role;
}

interface MembersStore {
  members: Member[];
  updateMember: (id: string, member: Member) => void;
  deleteMember: (id: string) => void;
  toggleRole: (id: string) => void;
}

export const useMembersStore = create<MembersStore>((set) => ({
  members: [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+1234567890",
      address: "123 Main St, City, Country",
      notificationPreference: "email",
      role: "member",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      phone: "+0987654321",
      address: "456 Oak St, Town, Country",
      notificationPreference: "whatsapp",
      role: "admin",
    },
  ],
  updateMember: (id, updatedMember) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? updatedMember : member
      ),
    })),
  deleteMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),
  toggleRole: (id) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id
          ? { ...member, role: member.role === "admin" ? "member" : "admin" }
          : member
      ),
    })),
}));