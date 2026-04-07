import { MainHeader } from '@/components/header/main-header';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
