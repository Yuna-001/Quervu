import { requireUserId } from '@/lib/auth/requireUserId';
import dbConnect from '@/lib/dbConnect';
import { HttpError } from '@/lib/error';
import QuestionModel from '@/models/question';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ questionId: string }>;
}

interface QuestionResponse {
  content: string;
  idealAnswer: string;
  tags: string[];
  isBookmarked: boolean;
  createdAt: Date;
}

// GET /api/questions/[questionId]
// - 사용자 소유의 특정 질문을 조회하는 핸들러
export async function GET(_req: Request, { params }: RouteParams) {
  const { questionId } = await params;

  let userId: string;

  try {
    ({ userId } = await requireUserId());
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error(
      `GET /api/questions/${questionId} unexpected error in requireUserId`,
      err,
    );

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }

  // questionId 유효성 검사
  if (!Types.ObjectId.isValid(questionId)) {
    return NextResponse.json(
      { error: '잘못된 질문 ID입니다.' },
      { status: 400 },
    );
  }

  try {
    await dbConnect();

    // 질문 조회
    const question = await QuestionModel.findOne(
      {
        _id: questionId,
        userId,
      },
      {
        _id: 0,
        content: 1,
        idealAnswer: 1,
        tags: 1,
        isBookmarked: 1,
        createdAt: 1,
      },
    ).lean<QuestionResponse | null>();

    // 질문이 존재하지 않을 경우 404 반환
    if (!question) {
      return NextResponse.json(
        { error: '해당 질문을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 질문이 존재하는 경우 질문 정보 반환
    return NextResponse.json<QuestionResponse>(question, { status: 200 });
  } catch (err) {
    console.error(`GET /api/questions/${questionId} db error`, err);

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
