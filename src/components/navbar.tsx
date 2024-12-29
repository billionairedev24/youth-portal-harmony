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
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationBell } from "./notification-bell";
import { ProfileUpdateDialog } from "./profile-update-dialog";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  const userInitials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setShowProfileDialog(true);
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    setShowSettingsDialog(true);
  };

  const handleDialogClose = () => {
    setShowProfileDialog(false);
    setShowSettingsDialog(false);
  };

  return (
    <>
      <header className="w-full bg-gradient-to-r from-gold-50/50 to-gold-100/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center flex-1">
            {!isAdminRoute && (
              <img 
                src="/placeholder.svg" 
                alt="Logo" 
                className="h-8 w-auto mr-4"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-gold-200/50"
                >
                  <Avatar className="h-10 w-10">
                    {mockUser.avatar && (
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    )}
                    <AvatarFallback className="bg-[#9b87f5] text-white font-semibold">
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
                    onSelect={handleProfileClick}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-gold-200/50"
                    onSelect={handleSettingsClick}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gold-200" />
                <DropdownMenuItem 
                  className="text-red-600 hover:bg-gold-200/50"
                  onSelect={handleLogout}
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
        onOpenChange={handleDialogClose}
      />

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={handleDialogClose}
      />
    </>
  );
}