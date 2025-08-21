'use client';

import { Sidebar } from '@/components/Sidebar';
import { RouteGuard } from '@/components/RouteGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </RouteGuard>
  );
}
