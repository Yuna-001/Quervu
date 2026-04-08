import { LogoutButton } from '@/components/auth/logout-button';
import { SettingMenu } from '@/components/header/setting-menu';
import { DarkModeToggle } from '@/components/theme/dark-mode-toggle';
import Link from 'next/link';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between flex-wrap border-b shadow-md bg-background">
      <Link href="/" className="font-lexend text-3xl">
        Quervu
      </Link>
      <div className="flex gap-4 flex-wrap">
        <SettingMenu />
        <DarkModeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
