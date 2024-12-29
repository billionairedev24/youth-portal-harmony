import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Vote,
  LayoutDashboard,
  MessageSquare,
  Megaphone,
  DollarSign,
  Image,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    setActiveRoute(location.pathname);
    setIsLoading(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: Vote, label: "Polls", href: "/admin/polls" },
    { icon: Users, label: "Members", href: "/admin/members" },
    { icon: MessageSquare, label: "Suggestions", href: "/admin/suggestions" },
    { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
    { icon: DollarSign, label: "Budget", href: "/admin/budget" },
    { icon: Image, label: "Photos", href: "/admin/photos" },
  ];

  const handleNavigation = (href: string) => {
    if (href !== location.pathname) {
      setIsLoading(true);
      navigate(href);
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex-shrink-0 h-screen transition-all duration-300",
        "bg-gradient-to-br from-gold-50 to-gold-100/90 backdrop-blur-sm",
        "dark:from-gold-900/40 dark:to-gold-950/60 dark:backdrop-blur-lg",
        "border-r border-gold-200/50 dark:border-gold-800/30",
        collapsed ? "w-16" : "w-64",
        isMobile && "fixed inset-y-0 left-0 w-16"
      )}
    >
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-20 z-50 p-0 border-0"
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6 text-gold-900 dark:text-gold-100" />
          ) : (
            <ChevronLeft className="h-6 w-6 text-gold-900 dark:text-gold-100" />
          )}
        </button>
      )}
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-4">
          <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
        </div>
        <nav className="flex-1 space-y-2 p-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex w-full items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200",
                "text-gold-800 dark:text-gold-100",
                "hover:bg-gold-200/50 dark:hover:bg-gold-800/30",
                (collapsed || isMobile) ? "justify-center" : "justify-start",
                activeRoute === item.href && "bg-gold-200/50 dark:bg-gold-800/40 font-medium"
              )}
              title={collapsed || isMobile ? item.label : undefined}
              disabled={isLoading}
            >
              {isLoading && activeRoute === item.href ? (
                <Spinner size="sm" className="text-gold-800 dark:text-gold-100" />
              ) : (
                <item.icon className="h-5 w-5 flex-shrink-0" />
              )}
              {!collapsed && !isMobile && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}