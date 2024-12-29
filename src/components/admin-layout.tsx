import { Navbar } from "./navbar";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gradient-to-br from-gold-50 via-gold-100/30 to-gold-200/20">
          {children}
        </main>
      </div>
    </div>
  );
}