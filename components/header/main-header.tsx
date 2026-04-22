import { HeaderActions } from '@/components/header/header-actions';
import Link from 'next/link';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between flex-wrap border-b shadow-md bg-background">
      <Link href="/" className="font-lexend text-3xl">
        Quervu
      </Link>
      <HeaderActions />
    </header>
  );
}
