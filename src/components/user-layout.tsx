import { Navbar } from "./navbar";

export function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100">
      <Navbar />
      <main className="container py-6">{children}</main>
    </div>
  );
}