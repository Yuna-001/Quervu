'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type TagListProps = {
  tags: string[];
  onRemove?: (index: number) => void;
};

export function TagList({ tags, onRemove }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2 ">
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="flex items-center justify-center gap-1 max-w-full cursor-default"
        >
          <div className="truncate">{tag}</div>
          {onRemove && (
            <button
              type="button"
              aria-label={`${tag} 삭제`}
              onClick={() => onRemove(index)}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
