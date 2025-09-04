import { Menu } from 'lucide-react';
import { UserType } from './user-context';

export default function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: UserType | null;
  onMenuClick?: () => void;
}) {
  return (
    <header
      className="
        h-16 flex items-center px-6 border-b shadow-sm bg-background z-30
        sticky top-0 w-full
      "
    >
      {onMenuClick && (
        <button
          className="mr-3 flex md:hidden p-2 rounded-md border bg-background shadow"
          aria-label="Mở menu"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      <span className="font-bold text-lg tracking-tight flex-1">
        Mini E-Wallet
      </span>
      <div className="flex items-center gap-3">
        <span className="font-medium hidden sm:block">
          {user ? user.name : 'Đang tải...'}
        </span>
        <img
          src={user && user.avatar ? user.avatar : '/default-avatar.png'}
          alt={user ? user.name : 'avatar'}
          className="w-9 h-9 rounded-full border"
        />
      </div>
    </header>
  );
}
