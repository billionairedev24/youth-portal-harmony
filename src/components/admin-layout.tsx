
import { Navbar } from "./navbar";
import { AdminSidebar } from "./admin-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gold-50 via-gold-100/30 to-gold-200/20 dark:from-gold-900/20 dark:via-gold-900/10 dark:to-gold-950/5 transition-colors duration-300">
      <AdminSidebar />
      <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'ml-0' : 'md:ml-0'}`}>
        <Navbar />
        <main className="flex-1 p-3 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
