'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

type DarkModeToggleProps = React.ComponentProps<typeof Button>;

export function DarkModeToggle({
  ref,
  onClick,
  ...props
}: DarkModeToggleProps & {
  ref?: React.Ref<React.ComponentRef<typeof Button>>;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggleMode = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const label =
    resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        handleToggleMode();
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
