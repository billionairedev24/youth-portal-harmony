
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
  Menu,
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
                className="bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent/50"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-0 max-h-[90vh]">
              <div className="bg-background h-full min-h-[60vh]">
                <div className="flex h-16 items-center justify-between px-4 border-b">
                  <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <ChevronLeft className="h-5 w-5" />
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
                        "text-foreground",
                        "hover:bg-accent/50",
                        "justify-start",
                        "group",
                        activeRoute === item.href && "bg-accent/80 font-medium"
                      )}
                      disabled={isLoading}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-md transition-all duration-300",
                        activeRoute === item.href ? "bg-primary/20" : "bg-background",
                        "group-hover:bg-primary/20"
                      )}>
                        {isLoading && activeRoute === item.href ? (
                          <Spinner size="sm" className="text-primary" />
                        ) : (
                          <item.icon className="h-4.5 w-4.5 text-primary" />
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
        "bg-background/95 backdrop-blur-sm",
        "border-r border-border/50",
        "shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-4 top-20 z-50 h-8 w-8 rounded-full shadow-sm bg-accent/20 hover:bg-accent/40 border border-border",
          "flex items-center justify-center transition-transform duration-300"
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-foreground" />
        )}
      </Button>
      <div className="flex h-full flex-col">
        <div className={cn(
          "flex h-16 items-center border-b border-border/50",
          collapsed ? "justify-center px-2" : "px-4"
        )}>
          <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
          {!collapsed && <span className="ml-3 text-lg font-medium text-foreground">Admin</span>}
        </div>
        <nav className="flex-1 space-y-2 p-2 mt-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-300",
                "text-foreground",
                "hover:bg-accent/50",
                collapsed ? "justify-center" : "justify-start",
                "group",
                activeRoute === item.href && "bg-accent/80 font-medium"
              )}
              title={collapsed ? item.label : undefined}
              disabled={isLoading}
            >
              <div className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md transition-all duration-300",
                activeRoute === item.href ? "bg-primary/20" : "bg-background",
                "group-hover:bg-primary/20"
              )}>
                {isLoading && activeRoute === item.href ? (
                  <Spinner size="sm" className="text-primary" />
                ) : (
                  <item.icon className="h-4.5 w-4.5 text-primary" />
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
