'use client';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  return (
    <Button
      variant='ghost'
      className='relative h-8 w-8 cursor-pointer rounded-full text-red-600 hover:bg-red-50 hover:text-red-600'
      onClick={handleLogout}
    >
      <LogOutIcon />
    </Button>
  );
}
