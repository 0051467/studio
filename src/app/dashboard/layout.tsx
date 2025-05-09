// src/app/dashboard/layout.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';

export default function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
  );
}
