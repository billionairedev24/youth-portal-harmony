import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "admin",
  avatar: "/placeholder.svg",
};

export const mockEvents = [
  {
    id: "1",
    title: "Youth Sunday Service",
    date: "2024-03-10",
    description: "Join us for our weekly youth service!",
  },
  {
    id: "2",
    title: "Bible Study",
    date: "2024-03-12",
    description: "Deep dive into Scripture",
  },
];

export const mockPolls = [
  {
    id: "1",
    question: "Next event theme?",
    options: ["Worship Night", "Game Night", "Movie Night"],
    votes: [10, 5, 8],
  },
];

export const mockMembers = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "user",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "user",
    joinDate: "2024-01-20",
  },
];