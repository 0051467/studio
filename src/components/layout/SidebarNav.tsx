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
} from "@/components/ui/sidebar"; 
import { AppLogo } from "./AppLogo";


const mainNavItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/dashboard/tournaments/new", label: "Giải đấu Mới", icon: PlusCircle },
];

const tournamentNavItems = [
    { href: "overview", label: "Chi tiết Giải đấu", icon: Trophy },
    { href: "events", label: "Hạng mục Sự kiện", icon: ListChecks },
    { href: "players", label: "Quản lý Vận động viên", icon: Users },
    { href: "draws", label: "Nhánh đấu", icon: GitFork },
    { href: "schedule", label: "Lịch thi đấu", icon: CalendarDays },
    { href: "scores", label: "Tỷ số & Kết quả", icon: ClipboardList },
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
            <SidebarGroupLabel>Chính</SidebarGroupLabel>
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
              <SidebarGroupLabel>Quản lý Giải đấu</SidebarGroupLabel>
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
          Trợ giúp
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
