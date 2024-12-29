import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGreeting, mockUser } from "@/lib/utils";
import { Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "./notification-bell";
import { ProfileUpdateDialog } from "./profile-update-dialog";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const userInitials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <header className="w-full bg-gradient-to-r from-gold-50/50 to-gold-100/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center flex-1">
            <img 
              src="/placeholder.svg" 
              alt="Logo" 
              className="h-8 w-auto mr-4"
            />
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-gold-200/50"
                >
                  <Avatar className="h-10 w-10 border-2 border-gold-200">
                    {mockUser.avatar && (
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    )}
                    <AvatarFallback className="bg-gold-100 text-gold-900 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-gradient-to-br from-gold-50 to-gold-100" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gold-900">
                      {getGreeting()}, {mockUser.name}
                    </p>
                    <p className="text-xs leading-none text-gold-600">
                      {mockUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gold-200" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="hover:bg-gold-200/50"
                    onClick={() => setShowProfileDialog(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gold-200/50"
                    onClick={() => setShowSettingsDialog(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gold-200" />
                <DropdownMenuItem 
                  className="text-red-600 hover:bg-gold-200/50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileUpdateDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
      />

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />
    </>
  );
}