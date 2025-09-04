'use client';
import Sidebar from './components/sidebar';
import DashboardHeader from './components/header';
import DashboardFooter from './components/footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nếu muốn responsive sidebar, dùng state ở đây
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Có thể lấy user từ context hoặc props nếu muốn
  const user = {
    name: 'Nguyễn Văn A',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana',
  };

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader user={user} onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar desktop */}
        <div className="hidden md:flex h-full">
          <Sidebar current="" />
        </div>
        {/* Sidebar mobile (Sheet) */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <span />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <DialogTitle className="sr-only">Menu</DialogTitle>
            <Sidebar current="" onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-y-auto p-6 pt-6">{children}</main>
      </div>
      <DashboardFooter />
    </div>
  );
}
