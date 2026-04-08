'use client';

import { HeaderIconTooltip } from '@/components/header/header-icon-tooltip';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function DarkModeToggle() {
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
    <HeaderIconTooltip label={label}>
      <Button variant="outline" size="icon" onClick={handleToggleMode}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">테마 전환</span>
      </Button>
    </HeaderIconTooltip>
  );
}
