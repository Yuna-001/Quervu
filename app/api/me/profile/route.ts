import { requireUserId } from '@/lib/auth/requireUserId';
import dbConnect from '@/lib/dbConnect';
import { HttpError } from '@/lib/error';
import ProfileModel from '@/models/profile';
import type { Profile, ProfileResponse } from '@/types/profile';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

// GET /api/me/profile
// - 사용자의 프로필을 조회하는 핸들러
export async function GET() {
  let userId: string;

  // 인증된 사용자의 ID 조회
  try {
    ({ userId } = await requireUserId());
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error('GET /api/me/profile unexpected error in requireUser', err);

    // 인증 이외의 예기치 못한 서버 오류
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }

  try {
    // DB 연결
    await dbConnect();

    // 사용자 프로필 조회
    const profile = await ProfileModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<Profile | null>();

    // 프로필이 없으면 기본값 반환
    if (!profile) {
      return NextResponse.json<ProfileResponse>(
        { position: null, skills: [], experience: null },
        { status: 200 },
      );
    }

    const { position, skills, experience } = profile;

    // 프로필이 존재하면 실제 값 반환
    return NextResponse.json<ProfileResponse>(
      { position, skills, experience },
      { status: 200 },
    );
  } catch (err) {
    console.error('GET /api/me/profile db error', err);

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
