import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Vote,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: Vote, label: "Polls", href: "/admin/polls" },
    { icon: Users, label: "Members", href: "/admin/members" },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gold-50 to-gold-100/90 backdrop-blur-sm transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
        isMobile && "w-16"
      )}
    >
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-5 top-20 z-50 h-10 w-10 rounded-full border-2 border-gold-300 bg-gradient-to-br from-gold-50 to-gold-100 shadow-lg hover:bg-gold-200/50 hover:shadow-xl transition-all"
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6 text-gold-900" />
          ) : (
            <ChevronLeft className="h-6 w-6 text-gold-900" />
          )}
        </Button>
      )}
      <div className="flex h-full flex-col pt-16">
        <nav className="flex-1 space-y-2 p-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 text-gold-800 transition-colors hover:bg-gold-200/50",
                (collapsed || isMobile) ? "justify-center" : "justify-start"
              )}
              title={collapsed || isMobile ? item.label : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && !isMobile && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}