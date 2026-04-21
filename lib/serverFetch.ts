import 'server-only';

import { headers } from 'next/headers';

type ErrorBody = { error: string };

type FetchErrorResult = {
  ok: false;
  status: number;
  message: string;
};

type FetchSuccessResult<T> = {
  ok: true;
  status: number;
  data: T;
};

type FetchNoContentSuccessResult = {
  ok: true;
  status: 204;
  data: null;
};

const isErrorBody = (value: unknown): value is ErrorBody => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  );
};

// 일반 JSON 응답용 오버로드
export function serverFetch<T>(
  path: string,
  init?: RequestInit & { expectNoContent?: false },
): Promise<FetchSuccessResult<T> | FetchErrorResult>;

// 204 No Content 응답용 오버로드
export function serverFetch(
  path: string,
  init: RequestInit & { expectNoContent: true },
): Promise<FetchNoContentSuccessResult | FetchErrorResult>;

// 실제 구현부
export async function serverFetch<T>(
  path: string,
  init?: RequestInit & { expectNoContent?: boolean },
): Promise<
  FetchSuccessResult<T> | FetchNoContentSuccessResult | FetchErrorResult
> {
  const h = await headers();
  const host = h.get('host');
  const protocol =
    h.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  const origin = `${protocol}://${host}`;

  const { expectNoContent, ...requestInit } = init ?? {};

  const res = await fetch(`${origin}${path}`, {
    ...requestInit,
    headers: {
      ...(requestInit.headers ?? {}),
      cookie: h.get('cookie') ?? '',
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);

    const message =
      (isErrorBody(body) && body.error) ||
      (typeof body === 'string' && body.trim()) ||
      res.statusText ||
      '요청이 실패하였습니다.';

    return {
      ok: false,
      status: res.status,
      message,
    };
  }

  if (expectNoContent) {
    if (res.status !== 204) {
      throw new Error(
        `204 No Content 응답을 기대했지만 ${res.status} 응답을 받았습니다.`,
      );
    }

    return {
      ok: true,
      status: 204,
      data: null,
    };
  }

  if (res.status === 204) {
    throw new Error(
      '응답 본문이 필요한 요청인데 204 No Content 응답을 받았습니다.',
    );
  }

  const contentType = res.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  return {
    ok: true,
    status: res.status,
    data: body as T,
  };
}
