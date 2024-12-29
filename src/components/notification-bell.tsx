import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationsStore } from "@/stores/notifications-store";
import { format } from "date-fns";

export function NotificationBell() {
  const { notifications, markAsRead, deleteNotification } = useNotificationsStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-gold-200/50"
        >
          <Bell className="h-5 w-5 text-gold-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-500 text-xs font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-gradient-to-br from-gold-50 to-gold-100"
      >
        <ScrollArea className={notifications.length === 0 ? "h-auto" : "max-h-[300px]"}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-gold-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gold-900 mb-1">
                No notifications yet
              </p>
              <p className="text-xs text-gold-600">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 focus:bg-gold-200/50 space-y-1"
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between items-start">
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${!notification.read ? "text-gold-900" : "text-gold-700"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gold-600">
                      {format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gold-600 hover:text-gold-900 hover:bg-gold-200/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gold-700">{notification.message}</p>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}