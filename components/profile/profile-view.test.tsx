import { render, screen } from '@testing-library/react';
import { ProfileView } from './profile-view';

const EMPTY = '아직 설정되지 않았습니다.';

const getByLabelledBy = (labelId: string): HTMLElement => {
  const el = document.querySelector(`[aria-labelledby="${labelId}"]`);

  if (!(el instanceof HTMLElement)) {
    throw new Error(
      `Element not found (or not HTMLElement): aria-labelledby="${labelId}"`,
    );
  }

  return el;
};

describe('ProfileView', () => {
  test('"수정" 링크는 프로필 수정 페이지로 연결된다', () => {
    render(
      <ProfileView
        profile={{ position: null, experience: null, skills: [] }}
      />,
    );

    expect(screen.getByRole('link', { name: '수정' })).toHaveAttribute(
      'href',
      '/setting/profile/edit',
    );
  });

  test('초기 상태면 직무/경력/기술 스택을 모두 미설정 문구로 표시한다', () => {
    render(
      <ProfileView
        profile={{ position: null, experience: null, skills: [] }}
      />,
    );

    expect(getByLabelledBy('position-label')).toHaveTextContent(EMPTY);
    expect(getByLabelledBy('experience-label')).toHaveTextContent(EMPTY);
    expect(getByLabelledBy('skills-label')).toHaveTextContent(EMPTY);
  });

  test('프로필이 설정된 상태면 직무/경력/기술 스택을 값으로 표시하고 미설정 문구는 표시하지 않는다', () => {
    render(
      <ProfileView
        profile={{
          position: '프론트엔드 개발자',
          experience: 3,
          skills: ['React', 'TypeScript'],
        }}
      />,
    );
    expect(getByLabelledBy('position-label')).toHaveTextContent(
      '프론트엔드 개발자',
    );
    expect(getByLabelledBy('experience-label')).toHaveTextContent('3년');

    expect(getByLabelledBy('skills-label')).toHaveTextContent('React');
    expect(getByLabelledBy('skills-label')).toHaveTextContent('TypeScript');

    expect(screen.queryByText(EMPTY)).not.toBeInTheDocument();
  });

  test('경력이 0이면 "0년"으로 표시한다', () => {
    render(
      <ProfileView profile={{ position: 'FE', experience: 0, skills: [] }} />,
    );

    expect(getByLabelledBy('experience-label')).toHaveTextContent('0년');
  });
});
