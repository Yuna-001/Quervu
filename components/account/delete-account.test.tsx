import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { DeleteAccount } from './delete-account';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}));

describe('DeleteAccount', () => {
  const setup = () => {
    const user = userEvent.setup();
    render(<DeleteAccount />);

    return { user };
  };

  const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(
      screen.getByRole('button', {
        name: '회원 탈퇴',
      }),
    );

    return screen.findByRole('alertdialog');
  };

  const getConfirmButton = (dialog: HTMLElement) =>
    within(dialog).getByRole('button', {
      name: '회원 탈퇴',
    });

  const getCancelButton = (dialog: HTMLElement) =>
    within(dialog).getByRole('button', {
      name: '취소',
    });

  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  test('회원 탈퇴 버튼 클릭 시 AlertDialog가 열린다', async () => {
    const { user } = setup();
    const dialog = await openDialog(user);

    expect(dialog).toBeInTheDocument();
  });

  test('AlertDialogAction 클릭 시 DELETE /api/me 요청을 보낸다', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    const { user } = setup();
    const dialog = await openDialog(user);

    await user.click(getConfirmButton(dialog));

    expect(fetchMock).toHaveBeenCalledWith('/api/me', {
      method: 'DELETE',
    });
  });

  test('회원 탈퇴 요청이 성공하면 callbackUrl이 /login인 signOut을 호출한다', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    const { user } = setup();
    const dialog = await openDialog(user);

    await user.click(getConfirmButton(dialog));

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('회원 탈퇴 요청이 실패하면 toast.error를 호출한다', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });

    const { user } = setup();
    const dialog = await openDialog(user);

    await user.click(getConfirmButton(dialog));

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('회원 탈퇴에 실패했습니다.');
    expect(signOut).not.toHaveBeenCalled();
  });

  test('네트워크 오류 발생 시 description을 포함한 toast.error를 호출한다', async () => {
    fetchMock.mockRejectedValueOnce(new Error());

    const { user } = setup();
    const dialog = await openDialog(user);

    await user.click(getConfirmButton(dialog));

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith('네트워크 오류가 발생했습니다.', {
      description: '인터넷 연결을 확인한 후 다시 시도해주세요.',
    });
    expect(signOut).not.toHaveBeenCalled();
  });

  test('취소 버튼을 누르면 회원 탈퇴 요청을 보내지 않는다', async () => {
    const { user } = setup();
    const dialog = await openDialog(user);

    await user.click(getCancelButton(dialog));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(signOut).not.toHaveBeenCalled();
  });
});
