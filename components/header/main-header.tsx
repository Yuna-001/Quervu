import Link from 'next/link';
import { HeaderActions } from './header-actions';

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
