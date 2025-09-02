import React, { useState } from 'react';
import Link from 'next/link';
import { Home, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const menu = [
  {
    label: 'Trang chủ',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Thanh toán hóa đơn',
    href: '/dashboard/bills',
    icon: <FileText className="w-5 h-5" />,
  },
];

export default function Sidebar({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  return (
    <aside
      className={cn(
        'relative h-full border-r bg-background flex flex-col transition-all duration-200',
        collapsed ? 'w-20 p-6' : 'w-64 p-6',
      )}
      onMouseEnter={() => setShowToggle(true)}
      onMouseLeave={() => setShowToggle(false)}
    >
      <div
        className="absolute top-0 right-0 h-full w-3 cursor-pointer z-20"
        onMouseEnter={() => setShowToggle(true)}
      />
      {showToggle && (
        <button
          className="absolute top-1/6 -right-4 -translate-y-1/2 z-30 bg-background border rounded-full shadow p-1 transition-opacity hidden md:block"
          onClick={() => setCollapsed((c) => !c)}
          tabIndex={-1}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}

      <div>
        <nav
          className={cn(
            collapsed
              ? 'flex flex-col gap-1 items-center'
              : 'flex flex-col gap-1',
          )}
        >
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                collapsed
                  ? 'flex items-center justify-center w-12 h-12 rounded-md transition-colors hover:bg-muted'
                  : 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted hover:text-accent-foreground',
                current === item.href &&
                  (collapsed
                    ? 'bg-muted text-primary'
                    : 'bg-muted font-semibold text-primary'),
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
