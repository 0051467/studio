// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Header } from './Header';
import { SidebarNav }
from './SidebarNav'; // Assuming this is the main sidebar navigation
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen> {/* Manages sidebar state */}
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <SidebarNav /> {/* This is your custom SidebarNav within the Sidebar component */}
          <SidebarInset> {/* This ensures content flows correctly next to the sidebar */}
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
