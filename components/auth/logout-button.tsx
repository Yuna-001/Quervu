'use client';

import { HeaderIconTooltip } from '@/components/header/header-icon-tooltip';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <HeaderIconTooltip label="로그아웃">
      <Button variant="outline" size="icon" onClick={handleLogout}>
        <LogOut />
      </Button>
    </HeaderIconTooltip>
  );
}
