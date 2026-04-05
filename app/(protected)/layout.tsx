import { LogoutButton } from '@/components/auth/logout-button';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LogoutButton />
      {children}
    </>
  );
}
