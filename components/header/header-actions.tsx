'use client';

import { LogoutButton } from '@/components/auth/logout-button';
import { SettingMenu } from '@/components/header/setting-menu';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';

export function HeaderActions() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SettingMenu />
      <DarkModeToggle />
      <LogoutButton />
    </div>
  );
}
