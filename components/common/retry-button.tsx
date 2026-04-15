'use client';

import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type RetryButtonProps = {
  title: string;
  description?: string;
};

export function RetryButton({ title, description }: RetryButtonProps) {
  const router = useRouter();

  return (
    <div className="flex max-sm:flex-col gap-4 justify-center items-center">
      <div className="flex flex-col justify-center gap-2">
        <p className="font-medium text-center">{title}</p>
        {description && (
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => router.refresh()}
        aria-label="재시도"
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
