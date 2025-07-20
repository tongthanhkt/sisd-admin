'use client';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/lib/api/auth';
import { useUser } from '@/hooks/use-user';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearAuthCookies, clearAllAuthData } from '@/lib/token-utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function UserNav() {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    try {
      // Gọi API logout
      await logout();

      // Xóa tất cả dữ liệu authentication
      clearAllAuthData();

      toast.success('Đăng xuất thành công!');

      // Redirect về trang login
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Ngay cả khi API call thất bại, vẫn xóa tất cả dữ liệu authentication
      clearAllAuthData();

      toast.error('Đăng xuất thất bại nhưng đã xóa thông tin đăng nhập');
      router.push('/auth/login');
    }
  };

  if (loading) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <UserIcon className='h-4 w-4' />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs'>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user?.email}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.userId}
            </p>
            {user?.role && (
              <Badge variant='secondary' className='w-fit text-xs'>
                {user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
