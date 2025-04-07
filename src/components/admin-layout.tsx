
import { Navbar } from "./navbar";
import { AdminSidebar } from "./admin-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollingMessage } from "./scrolling-message";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <AdminSidebar />
      <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'ml-0' : 'md:ml-0'}`}>
        <Navbar />
        <ScrollingMessage />
        <main className="flex-1 p-3 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
