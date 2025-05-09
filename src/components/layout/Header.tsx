import { AppLogo } from "./AppLogo";
import { UserNav } from "./UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar"; // If using the complex sidebar component
import { Button } from "../ui/button";
import Link from "next/link";

interface HeaderProps {
  showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 items-center">
          {showSidebarTrigger && (
            <div className="md:hidden"> {/* Only show trigger on mobile if sidebar is collapsible */}
               <SidebarTrigger />
            </div>
          )}
          <AppLogo className="hidden md:flex" />
           <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Bảng điều khiển
            </Link>
            <Link
              href="/tournaments"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Xem công khai
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* Add other header items here if needed, e.g., theme toggle */}
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
