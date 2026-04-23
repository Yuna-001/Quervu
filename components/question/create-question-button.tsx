'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function CreateQuestionButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateQuestion = async () => {
    let navigated = false;
    setIsCreating(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
      });

      if (!res.ok) {
        toast.error('질문 생성에 실패했습니다.', {
          description: '잠시 후 다시 시도해주세요.',
        });
        return;
      }

      const { questionId } = await res.json();

      navigated = true;
      router.push(`/questions/${questionId}`);
    } catch {
      toast.error('네트워크 오류가 발생했습니다.', {
        description: '인터넷 연결을 확인한 후 다시 시도해주세요.',
      });
    } finally {
      if (!navigated) setIsCreating(false);
    }
  };

  return (
    <Button disabled={isCreating} onClick={handleCreateQuestion}>
      {isCreating ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          질문 생성 중...
        </span>
      ) : (
        '새로운 질문 생성'
      )}
    </Button>
  );
}
