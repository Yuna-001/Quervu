import 'server-only';

import { headers } from 'next/headers';

export type FetchResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: true; status: 204; data: null }
  | { ok: false; status: number; message: string };

type ErrorBody = { error: string };

const isErrorBody = (value: unknown): value is ErrorBody => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  );
};

export const serverFetch = async <T>(
  path: string,
  init?: RequestInit,
): Promise<FetchResult<T>> => {
  const h = await headers();
  const host = h.get('host');
  const protocol =
    h.get('x-forwarded-proto') ??
    (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      cookie: h.get('cookie') ?? '',
    },
  });

  if (res.status === 204) {
    return { ok: true, status: 204, data: null };
  }

  const contentType = res.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
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

  return { ok: true, status: res.status, data: body as T };
};
