import type { ProfileResponse } from '@/types/profile';
import { render, screen } from '@testing-library/react';
import { ProfileForm } from './profile-form';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const emptyProfile: ProfileResponse = {
  position: null,
  experience: null,
  skills: [],
};

const filledProfile: ProfileResponse = {
  position: '프론트엔드',
  experience: 3,
  skills: ['Next.js', 'TypeScript'],
};

describe('ProfileForm', () => {
  describe('초기 렌더링', () => {
    test('initialProfile이 있을 때 직무와 경력이 입력 필드의 기본값으로 렌더링된다', () => {
      render(<ProfileForm initialProfile={filledProfile} />);

      expect(screen.getByLabelText(/직무/)).toHaveValue('프론트엔드');
      expect(screen.getByLabelText(/경력/)).toHaveValue(3);
    });

    test('initialProfile이 있을 때 기술 스택이 태그 목록으로 렌더링된다', () => {
      render(<ProfileForm initialProfile={filledProfile} />);

      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    test('initialProfile이 null/빈 값이면 입력 필드는 비어 있고 태그는 렌더링되지 않는다', () => {
      render(<ProfileForm initialProfile={emptyProfile} />);

      expect(screen.getByLabelText(/직무/)).toHaveValue('');
      expect(screen.getByLabelText(/경력/)).toHaveValue(null);

      expect(screen.queryByText('Next.js')).not.toBeInTheDocument();
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });

    test('초기 렌더링 시 에러 메시지를 표시하지 않는다', () => {
      render(<ProfileForm initialProfile={emptyProfile} />);

      expect(screen.getByLabelText(/직무/)).toHaveAttribute(
        'aria-invalid',
        'false',
      );
      expect(screen.getByLabelText(/경력/)).toHaveAttribute(
        'aria-invalid',
        'false',
      );
    });

    test('초기 렌더링 시 저장 버튼은 활성화 상태로 렌더링된다', () => {
      render(<ProfileForm initialProfile={emptyProfile} />);

      expect(screen.getByRole('button', { name: /저장/ })).not.toBeDisabled();
    });

    test('초기 렌더링 시 기술 스택 입력창은 비어 있다', () => {
      render(<ProfileForm initialProfile={emptyProfile} />);

      expect(screen.getByLabelText(/기술 스택/)).toHaveValue('');
    });
  });

  describe('클라이언트 유효성 검사', () => {});

  describe('기술 스택 입력', () => {});

  describe('기술 스택 삭제', () => {});

  describe('제출', () => {});
});
