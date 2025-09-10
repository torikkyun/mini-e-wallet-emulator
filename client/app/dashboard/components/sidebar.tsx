import React, { useState } from 'react';
import Link from 'next/link';
import { Home, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const menu = [
  {
    label: 'Trang chủ',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Thanh toán hóa đơn',
    href: '/dashboard/bills',
    icon: FileText,
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
        collapsed
          ? 'w-16 md:w-20 lg:w-24 py-4 md:py-6 px-2 md:px-3'
          : 'w-48 md:w-56 lg:w-64 p-4 md:p-6',
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
          className="absolute top-1/6 -right-3 lg:-right-4 -translate-y-1/2 z-30 bg-background border rounded-full shadow p-1 transition-opacity hidden md:block"
          onClick={() => setCollapsed((c) => !c)}
          tabIndex={-1}
        >
          {collapsed ? (
            <ChevronRight size={16} className="md:w-5 md:h-5" />
          ) : (
            <ChevronLeft size={16} className="md:w-5 md:h-5" />
          )}
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
          {menu.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  collapsed
                    ? 'flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-md transition-colors hover:bg-muted'
                    : 'flex items-center gap-2 md:gap-3 py-2 rounded-lg transition-colors hover:bg-muted hover:text-accent-foreground px-2 md:px-3',
                  current === item.href &&
                    (collapsed
                      ? 'bg-muted text-primary'
                      : 'bg-muted font-semibold text-primary'),
                )}
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                {!collapsed && (
                  <span className="text-sm md:text-base">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
