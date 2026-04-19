import { MAX_EXPERIENCE } from '@/lib/constants/profile';
import { createDeferred } from '@/test/utils/async';
import type { ProfileResponse } from '@/types/profile';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { ProfileForm } from './profile-form';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
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

const SERVER_ERROR_TEXT = '서버 에러가 발생했습니다.' as const;
const POSITION_ERROR_TEXT = '직무를 입력해주세요.' as const;
const EXPERIENCE_ERROR_TEXT =
  `경력은 0~${MAX_EXPERIENCE} 사이의 정수를 입력해주세요.` as const;

const VALID_POSITION = '프론트엔드';

const typeValidPositionAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.type(screen.getByLabelText(/직무/), VALID_POSITION);
  await user.click(screen.getByRole('button', { name: /저장/ }));
};

const FAIL_500 = {
  ok: false,
  status: 500,
  json: async () => ({ error: SERVER_ERROR_TEXT }),
};

const POSITION_400 = {
  ok: false,
  status: 400,
  json: async () => ({ error: POSITION_ERROR_TEXT }),
};
const EXPERIENCE_400 = {
  ok: false,
  status: 400,
  json: async () => ({ error: EXPERIENCE_ERROR_TEXT }),
};

const SUCCESS_204 = {
  ok: true,
  status: 204,
  json: async () => null,
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

  describe('클라이언트 유효성 검사', () => {
    let mockFetch: jest.Mock;
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
      mockFetch = jest.fn();
      global.fetch = mockFetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    test('직무를 빈 값으로 저장하면 에러 문구를 표시한다', async () => {
      const user = userEvent.setup();

      render(<ProfileForm initialProfile={emptyProfile} />);

      await user.click(screen.getByRole('button', { name: /저장/ }));

      expect(screen.getByText(POSITION_ERROR_TEXT)).toBeInTheDocument();
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test.each(['-1', String(MAX_EXPERIENCE + 1), '0.7'])(
      `경력이 %s이면 에러 문구를 표시한다`,
      async (value) => {
        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        const experienceInput = screen.getByLabelText(/경력/);

        await user.clear(experienceInput);
        await user.type(experienceInput, value);

        await typeValidPositionAndSubmit(user);

        expect(screen.getByText(EXPERIENCE_ERROR_TEXT)).toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
      },
    );

    test('직무 에러가 표시된 뒤 직무를 수정하면 에러 문구가 사라진다', async () => {
      const user = userEvent.setup();

      render(<ProfileForm initialProfile={emptyProfile} />);

      const positionInput = screen.getByLabelText(/직무/);
      const submitButton = screen.getByRole('button', { name: '저장' });

      await user.click(submitButton);

      expect(screen.getByText(POSITION_ERROR_TEXT)).toBeInTheDocument();

      await user.type(positionInput, '프론트엔드 개발자');

      expect(screen.queryByText(POSITION_ERROR_TEXT)).not.toBeInTheDocument();
    });

    test('경력 에러가 표시된 뒤 경력을 수정하면 에러 문구가 사라진다', async () => {
      const user = userEvent.setup();

      render(<ProfileForm initialProfile={emptyProfile} />);

      const experienceInput = screen.getByLabelText(/경력/);

      await user.clear(experienceInput);
      await user.type(experienceInput, '-1');

      await typeValidPositionAndSubmit(user);

      expect(screen.getByText(EXPERIENCE_ERROR_TEXT)).toBeInTheDocument();

      await user.clear(experienceInput);

      expect(screen.queryByText(EXPERIENCE_ERROR_TEXT)).not.toBeInTheDocument();
    });
  });

  describe('기술 스택 입력', () => {
    test.each([
      ['Enter', '{Enter}'],
      ['콤마(,)', ','],
    ])(
      '기술 스택을 입력 후 %s를 누르면 입력한 기술 스택이 목록에 추가되고 input이 비워진다',
      async (_, key) => {
        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        const skillInput = screen.getByLabelText(/기술 스택/);

        await user.type(skillInput, `React${key}`);

        expect(skillInput).toHaveValue('');
        expect(screen.getByText('React')).toBeInTheDocument();
      },
    );

    test.each([
      ['Enter', '{Enter}'],
      ['콤마(,)', ','],
    ])(
      '공백만 입력하고 %s를 누르면 기술 스택이 추가되지 않는다',
      async (_, key) => {
        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        const skillInput = screen.getByLabelText(/기술 스택/);

        await user.type(skillInput, ` ${key}`);

        expect(screen.queryByText('React')).not.toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
      },
    );

    test('같은 기술 스택을 다시 입력하면 중복 추가되지 않는다', async () => {
      const user = userEvent.setup();

      render(<ProfileForm initialProfile={emptyProfile} />);

      const skillInput = screen.getByLabelText(/기술 스택/);

      await user.type(skillInput, 'React{Enter}');
      await user.type(skillInput, 'React{Enter}');

      expect(screen.getAllByText('React')).toHaveLength(1);
    });
  });

  describe('기술 스택 삭제', () => {
    test('배지의 X 버튼을 누르면 해당 기술 스택이 삭제된다', async () => {
      const user = userEvent.setup();

      render(<ProfileForm initialProfile={emptyProfile} />);

      const skillInput = screen.getByLabelText(/기술 스택/);

      await user.type(skillInput, 'React{Enter}');
      await user.type(skillInput, 'TypeScript{Enter}');

      await user.click(screen.getByRole('button', { name: 'React 삭제' }));

      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  describe('제출', () => {
    let mockFetch: jest.Mock;
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
      mockFetch = jest.fn();
      global.fetch = mockFetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    describe('저장 성공', () => {
      test('유효한 입력값으로 제출하면 프로필 저장 요청을 보낸다', async () => {
        mockFetch.mockResolvedValue(SUCCESS_204);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await typeValidPositionAndSubmit(user);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('/api/me/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...emptyProfile, position: VALID_POSITION }),
        });
      });

      test('프로필 저장에 성공하면 프로필 보기 페이지로 이동한다', async () => {
        mockFetch.mockResolvedValue(SUCCESS_204);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await typeValidPositionAndSubmit(user);

        expect(mockPush).toHaveBeenCalledWith('/setting/profile');
      });
    });

    describe('저장 요청 중 상태', () => {
      test('저장 요청 중에는 저장 버튼이 비활성화된다', async () => {
        const deferred = createDeferred();
        mockFetch.mockReturnValueOnce(deferred.promise);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await user.type(screen.getByLabelText(/직무/), VALID_POSITION);

        const saveButton = screen.getByRole('button', { name: /저장/ });

        await user.click(saveButton);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        const loadingButton = screen.getByRole('button', { name: /저장 중/ });

        expect(loadingButton).toBe(saveButton);
        expect(loadingButton).toBeDisabled();

        expect(mockPush).not.toHaveBeenCalled();

        deferred.resolve(SUCCESS_204);

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/setting/profile');
        });
      });
    });

    describe('저장 요청 실패 처리', () => {
      test('저장 요청이 실패하면 저장 버튼이 다시 활성화된다', async () => {
        const deferred = createDeferred();
        mockFetch.mockReturnValueOnce(deferred.promise);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await user.type(screen.getByLabelText(/직무/), VALID_POSITION);

        const saveButton = screen.getByRole('button', { name: /저장/ });
        await user.click(saveButton);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(saveButton).toBeDisabled();

        deferred.resolve(FAIL_500);

        await waitFor(() => {
          expect(saveButton).toBeEnabled();
        });

        expect(mockPush).not.toHaveBeenCalled();
      });

      test('서버 메시지에 "직무"가 포함되면 직무 에러 문구를 표시한다', async () => {
        mockFetch.mockResolvedValue(POSITION_400);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await typeValidPositionAndSubmit(user);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        expect(
          await screen.findByText(POSITION_ERROR_TEXT),
        ).toBeInTheDocument();
      });

      test('서버 메시지에 "경력"이 포함되면 경력 에러 문구를 표시한다', async () => {
        mockFetch.mockResolvedValue(EXPERIENCE_400);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        const experienceInput = screen.getByLabelText(/경력/);
        await user.clear(experienceInput);
        await user.type(experienceInput, '3');

        await typeValidPositionAndSubmit(user);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        expect(
          await screen.findByText(EXPERIENCE_ERROR_TEXT),
        ).toBeInTheDocument();
      });

      test('서버 메시지에 "직무" 또는 "경력"이 없으면 일반 에러 토스트를 표시한다', async () => {
        mockFetch.mockResolvedValue(FAIL_500);

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await typeValidPositionAndSubmit(user);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            '프로필 저장에 실패했습니다.',
            {
              description: '잠시 후 다시 시도해주세요.',
            },
          );
        });
      });

      test('요청 중 네트워크 오류가 발생하면 네트워크 에러 토스트를 표시한다', async () => {
        mockFetch.mockRejectedValue(new Error());

        const user = userEvent.setup();

        render(<ProfileForm initialProfile={emptyProfile} />);

        await typeValidPositionAndSubmit(user);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            '네트워크 오류가 발생했습니다.',
            {
              description: '인터넷 연결을 확인한 후 다시 시도해주세요.',
            },
          );
        });
      });
    });
  });
});
