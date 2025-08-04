
import { redirect } from 'next/navigation';
import { useSocketUserLoggedIn } from '@/hooks/useSocketUserLoggedIn';
import { toast } from 'sonner';

export default function HomePage() {

  useSocketUserLoggedIn((data) => {
    console.log("New user loggin");
    toast.success(`User đã login! ID: ${data.id}, Email: ${data.email}`);
  });

  // ...phần UI khác hoặc redirect nếu cần
  return null;
}
