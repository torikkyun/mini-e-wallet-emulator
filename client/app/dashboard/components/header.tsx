import { Menu, User, LogOut, Wallet } from 'lucide-react';
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
      <span className="font-bold text-lg tracking-tight flex-1 flex items-center gap-2 ml-3">
        <Wallet className="w-6 h-6 text-primary" />
        Mini E-Wallet
      </span>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0">
              <span className="font-medium hidden sm:block">
                {user ? user.name : 'Đang tải...'}
              </span>
              <Avatar className="w-9 h-9 border">
                <AvatarImage
                  src={
                    user && user.avatar ? user.avatar : '/default-avatar.png'
                  }
                  alt={user ? user.name : 'avatar'}
                />
                <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
