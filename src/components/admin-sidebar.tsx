
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // For mobile drawer
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="fixed top-4 left-4 z-30">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gold-100/80 dark:bg-gold-800/80 backdrop-blur-sm border-gold-200 dark:border-gold-700 shadow-md hover:shadow-lg"
              >
                <PanelLeftOpen className="h-5 w-5 text-gold-700 dark:text-gold-300" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-0 max-h-[90vh]">
              <div className="bg-gradient-to-br from-gold-50 to-gold-100/90 dark:from-gold-900/40 dark:to-gold-950/60 h-full min-h-[60vh]">
                <div className="flex h-16 items-center justify-between px-4 border-b border-gold-200/50 dark:border-gold-800/30">
                  <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <ChevronLeft className="h-5 w-5 text-gold-700 dark:text-gold-300" />
                  </Button>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        handleNavigation(item.href);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-300",
                        "text-gold-800 dark:text-gold-100",
                        "hover:bg-gold-200/50 dark:hover:bg-gold-800/30",
                        "justify-start",
                        "group",
                        activeRoute === item.href && "bg-gold-200/70 dark:bg-gold-800/60 font-medium"
                      )}
                      disabled={isLoading}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-md transition-all duration-300",
                        activeRoute === item.href ? "bg-gold-300/70 dark:bg-gold-700/60" : "bg-gold-200/30 dark:bg-gold-800/30",
                        "group-hover:bg-gold-300/70 dark:group-hover:bg-gold-700/60"
                      )}>
                        {isLoading && activeRoute === item.href ? (
                          <Spinner size="sm" className="text-gold-800 dark:text-gold-100" />
                        ) : (
                          <item.icon className="h-4.5 w-4.5 text-gold-700 dark:text-gold-300" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex-shrink-0 h-screen transition-all duration-300 ease-in-out z-20",
        "bg-gradient-to-br from-gold-50 to-gold-100/90 backdrop-blur-sm",
        "dark:from-gold-900/40 dark:to-gold-950/60 dark:backdrop-blur-lg",
        "border-r border-gold-200/50 dark:border-gold-800/30",
        "shadow-md dark:shadow-lg shadow-gold-200/30 dark:shadow-black/30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div 
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-20 z-50 flex items-center justify-center",
          "w-6 h-12 rounded-full cursor-pointer transition-all duration-300",
          "bg-gold-100 dark:bg-gold-800 shadow-md hover:shadow-lg",
          "border border-gold-200 dark:border-gold-700"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4 text-gold-700 dark:text-gold-300" />
        ) : (
          <PanelLeftClose className="h-4 w-4 text-gold-700 dark:text-gold-300" />
        )}
      </div>
      <div className="flex h-full flex-col">
        <div className={cn(
          "flex h-16 items-center border-b border-gold-200/50 dark:border-gold-800/30",
          collapsed ? "justify-center px-2" : "px-4"
        )}>
          <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
          {!collapsed && <span className="ml-3 text-lg font-medium text-gold-800 dark:text-gold-200">Admin</span>}
        </div>
        <nav className="flex-1 space-y-2 p-2 mt-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-300",
                "text-gold-800 dark:text-gold-100",
                "hover:bg-gold-200/50 dark:hover:bg-gold-800/30",
                collapsed ? "justify-center" : "justify-start",
                "group",
                activeRoute === item.href && "bg-gold-200/70 dark:bg-gold-800/60 font-medium"
              )}
              title={collapsed ? item.label : undefined}
              disabled={isLoading}
            >
              <div className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md transition-all duration-300",
                activeRoute === item.href ? "bg-gold-300/70 dark:bg-gold-700/60" : "bg-gold-200/30 dark:bg-gold-800/30",
                "group-hover:bg-gold-300/70 dark:group-hover:bg-gold-700/60"
              )}>
                {isLoading && activeRoute === item.href ? (
                  <Spinner size="sm" className="text-gold-800 dark:text-gold-100" />
                ) : (
                  <item.icon className="h-4.5 w-4.5 text-gold-700 dark:text-gold-300" />
                )}
              </div>
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
