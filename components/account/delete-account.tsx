'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export function DeleteAccount() {
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/me`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('회원 탈퇴에 실패하였습니다.');
        return;
      }

      signOut({ callbackUrl: '/login' });
    } catch {
      toast.error('네트워크 오류가 발생했습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  return <Button onClick={handleDeleteAccount}>회원 탈퇴</Button>;
}
