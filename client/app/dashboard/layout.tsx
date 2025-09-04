'use client';

import Sidebar from './components/sidebar';
import DashboardHeader from './components/header';
import DashboardFooter from './components/footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserProvider, UserType } from './components/user-context';
import { WalletContext, WalletType } from './components/wallet-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [wallet, setWallet] = useState<WalletType | null>(null);

  const fetchWallet = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const walletRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wallets/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setWallet(walletRes.data?.data?.wallet);
    } catch {
      setWallet(null);
    }
  };

  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setUser(userRes.data?.data?.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchWallet();
  }, []);

  return (
    <UserProvider user={user} setUser={setUser}>
      <WalletContext.Provider value={{ wallet, reloadWallet: fetchWallet }}>
        <div className="h-screen flex flex-col">
          <DashboardHeader
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
          />
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
      </WalletContext.Provider>
    </UserProvider>
  );
}
