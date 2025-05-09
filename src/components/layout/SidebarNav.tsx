// src/components/layout/SidebarNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListChecks, 
  CalendarDays,
  Users,
  GitFork,
  ClipboardList,
  Trophy
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar"; // Assuming you have this advanced sidebar
import { AppLogo } from "./AppLogo";


const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tournaments/new", label: "New Tournament", icon: PlusCircle },
];

// These items would typically be dynamic based on the selected tournament
const tournamentSpecificNavItemsBase = "/dashboard/tournaments/[id]/manage"; // Placeholder base
const tournamentNavItems = [
    { href: "overview", label: "Tournament Details", icon: Trophy },
    { href: "events", label: "Event Categories", icon: ListChecks },
    { href: "players", label: "Player Management", icon: Users },
    { href: "draws", label: "Draws", icon: GitFork },
    { href: "schedule", label: "Schedule", icon: CalendarDays },
    { href: "scores", label: "Scores & Results", icon: ClipboardList },
];


export function SidebarNav() {
  const pathname = usePathname();
  const tournamentIdMatch = pathname.match(/\/dashboard\/tournaments\/([^/]+)\/manage/);
  const currentTournamentId = tournamentIdMatch ? tournamentIdMatch[1] : null;

  return (
    <Sidebar collapsible="icon" defaultOpen={true} side="left" variant="sidebar">
      <SidebarHeader>
        <AppLogo iconSize={8} textSize="xl" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>

          {currentTournamentId && (
            <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Manage Tournament</SidebarGroupLabel>
              {tournamentNavItems.map((item) => {
                const fullPath = `/dashboard/tournaments/${currentTournamentId}/manage/${item.href}`;
                return (
                  <SidebarMenuItem key={item.href}>
                     <Link href={fullPath} passHref legacyBehavior>
                       <SidebarMenuButton
                        asChild
                        isActive={pathname === fullPath || pathname.startsWith(`${fullPath}/`)}
                        tooltip={item.label}
                      >
                        <a>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarGroup>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start">
          Help
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
