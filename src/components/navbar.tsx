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
import { Settings, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-gold-100 to-gold-200 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Button
          variant="ghost"
          className="mr-4 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gold-900">Youth Group</span>
          </a>
        </div>
        <nav
          className={cn(
            "absolute left-0 right-0 top-16 bg-gradient-to-r from-gold-100 to-gold-200 p-4 md:static md:p-0 transform transition-transform duration-200 ease-in-out md:transform-none",
            isOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"
          )}
        >
          <ul className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <li>
              <a href="/events" className="text-gold-900 hover:text-gold-700">
                Events
              </a>
            </li>
            <li>
              <a href="/polls" className="text-gold-900 hover:text-gold-700">
                Polls
              </a>
            </li>
            <li>
              <a href="/members" className="text-gold-900 hover:text-gold-700">
                Members
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-gold-200"
                >
                  <Avatar className="h-10 w-10 border-2 border-gold-300">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-gold-200 text-gold-900">
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getGreeting()}, {mockUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {mockUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}