
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
  birthday: string;
  notificationPreference: NotificationPreference;
  role: Role;
}

interface MembersStore {
  members: Member[];
  updateMember: (id: string, member: Member) => void;
  deleteMember: (id: string) => void;
  toggleRole: (id: string) => void;
  getMembersByPreference: (preference: NotificationPreference | "all") => Member[];
}

export const useMembersStore = create<MembersStore>((set, get) => ({
  members: [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+1234567890",
      address: "123 Main St, City, Country",
      birthday: "1995-03-15",
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
      birthday: "1992-07-22",
      notificationPreference: "whatsapp",
      role: "admin",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria@example.com",
      phone: "+1122334455",
      address: "789 Pine St, Village, Country",
      birthday: "1988-11-05",
      notificationPreference: "sms",
      role: "member",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      firstName: "David",
      lastName: "Johnson",
      email: "david@example.com",
      phone: "+5566778899",
      address: "321 Cedar St, Suburb, Country",
      birthday: "1990-04-12",
      notificationPreference: "email",
      role: "member",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      phone: "+9988776655",
      address: "654 Elm St, Metropolis, Country",
      birthday: "1993-08-27",
      notificationPreference: "whatsapp",
      role: "member",
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
  getMembersByPreference: (preference) => {
    const { members } = get();
    if (preference === "all") {
      return members;
    }
    return members.filter(
      (member) => member.notificationPreference === preference
    );
  },
}));
