'use client';

import { LogoutButton } from '@/components/auth/logout-button';
import { HeaderIconTooltip } from '@/components/header/header-icon-tooltip';
import { SettingMenu } from '@/components/header/setting-menu';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';

export function HeaderActions() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SettingMenu />
      <HeaderIconTooltip label="테마 전환">
        <DarkModeToggle />
      </HeaderIconTooltip>
      <HeaderIconTooltip label="로그아웃">
        <LogoutButton />
      </HeaderIconTooltip>
    </div>
  );
}
