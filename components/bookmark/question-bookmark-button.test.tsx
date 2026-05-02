import { clientFetch } from '@/lib/fetch/client';
import type { MockClientFetch } from '@/test/types';
import { render, screen } from '@testing-library/react';
import { QuestionBookmarkButton } from './question-bookmark-button';

jest.mock('@/lib/fetch/client', () => ({
  clientFetch: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}));

const mockClientFetch = clientFetch as unknown as MockClientFetch;

const QUESTION_ID = 'q1';

describe('QuestionBookmarkButton', () => {
  describe('초기 렌더링', () => {
    test('북마크되지 않은 상태면 북마크 추가 버튼으로 표시한다', () => {
      render(
        <QuestionBookmarkButton
          questionId={QUESTION_ID}
          initialIsBookmarked={false}
        />,
      );

      const button = screen.getByRole('button', { name: '북마크 추가' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    test('북마크된 상태면 북마크 해제 버튼으로 표시한다', () => {
      render(
        <QuestionBookmarkButton
          questionId={QUESTION_ID}
          initialIsBookmarked={true}
        />,
      );

      const button = screen.getByRole('button', { name: '북마크 해제' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
