import { authAdapter } from '@/lib/auth/adapter';
import { requireUserId } from '@/lib/auth/requireUserId';
import client from '@/lib/db';
import { HttpError } from '@/lib/error';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// DELETE /api/me
// - 사용자의 계정을 삭제하는 핸들러
export async function DELETE() {
  let userId: string;

  // 인증된 사용자의 ID 조회
  try {
    ({ userId } = await requireUserId());
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error(
      'DELETE /api/me/account unexpected error in requireUser',
      err,
    );

    // 인증 이외의 예기치 못한 서버 오류
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }

  try {
    const db = client.db();

    // account 조회
    const accountsCol = db.collection('accounts');
    const account = await accountsCol.findOne({ userId: new ObjectId(userId) });

    if (!account) {
      console.error('Account not found for userId', userId);

      return NextResponse.json(
        { error: '서버 에러가 발생했습니다.' },
        { status: 500 },
      );
    }

    if (!authAdapter.deleteUser) {
      console.error('authAdapter.deleteUser is not implemented');

      return NextResponse.json(
        { error: '서버 에러가 발생했습니다.' },
        { status: 500 },
      );
    }

    // users 컬렉션과 accounts 컬렉션에서 사용자 삭제
    await authAdapter.deleteUser(userId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('DELETE /api/me/account unexpected error', err);

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
