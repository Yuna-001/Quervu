'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

type LogoutButtonProps = React.ComponentProps<typeof Button>;

export function LogoutButton({
  ref,
  onClick,
  ...props
}: LogoutButtonProps & {
  ref?: React.Ref<React.ComponentRef<typeof Button>>;
}) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        handleLogout();
      }}
    >
      <LogOut />
    </Button>
  );
}
