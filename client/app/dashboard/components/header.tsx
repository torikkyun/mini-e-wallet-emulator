import { Menu, User, LogOut, Wallet, CreditCard } from 'lucide-react';
import { UserType } from './user-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: UserType | null;
  onMenuClick?: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
  };

  return (
    <header
      className="
        h-16 flex items-center px-4 sm:px-6 border-b shadow-sm bg-background z-30
        sticky top-0 w-full
      "
    >
      {onMenuClick && (
        <button
          className="mr-2 sm:mr-3 flex md:hidden p-2 rounded-md border bg-background shadow"
          aria-label="Mở menu"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      <div className="font-bold tracking-tight flex-1 flex items-center gap-2 ml-1 sm:ml-3 min-w-0">
        <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
        <span className="text-base sm:text-lg">Mini E-Wallet</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 sm:gap-2 cursor-pointer bg-transparent border-none p-0 hover:bg-muted/50 rounded-md px-1 sm:px-2 py-1 transition-colors">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-medium text-sm truncate">
                  {user ? user.name : 'Đang tải...'}
                </span>
                {user?.accountNumber && (
                  <span className="text-xs text-muted-foreground font-mono flex items-center">
                    <CreditCard className="mr-1 h-4 w-4" />
                    {user.accountNumber}
                  </span>
                )}
              </div>
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border flex-shrink-0">
                <AvatarImage
                  src={
                    user && user.avatar ? user.avatar : '/default-avatar.png'
                  }
                  alt={user ? user.name : 'avatar'}
                />
                <AvatarFallback className="text-xs sm:text-sm">
                  {user?.name?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <div className="sm:hidden px-2 py-2 border-b">
              <div className="font-medium text-sm mb-1">
                {user ? user.name : 'Đang tải...'}
              </div>
              {user?.accountNumber && (
                <div className="text-xs text-muted-foreground font-mono flex items-center">
                  <CreditCard className="mr-1 h-3 w-3" />
                  {user.accountNumber}
                </div>
              )}
            </div>
            <DropdownMenuItem onClick={handleProfile}>
              <User className="w-4 h-4 mr-2" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
