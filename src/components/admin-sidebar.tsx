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
import { useState } from "react";

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-7 z-50 h-8 w-8 rounded-full border-2 border-gold-300 bg-gradient-to-br from-gold-50 to-gold-100 shadow-lg hover:bg-gold-200/50 hover:shadow-xl transition-all"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5 text-gold-800" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-gold-800" />
        )}
      </Button>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-4">
          <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
          {!collapsed && (
            <span className="ml-2 font-bold text-xl text-gold-900">
              Youth Group
            </span>
          )}
        </div>
        <nav className="flex-1 space-y-2 p-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 text-gold-800 transition-colors hover:bg-gold-200/50",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}