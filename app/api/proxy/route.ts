import { NextRequest, NextResponse } from 'next/server';
import handler from '../../../api/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Keep the legacy action contract behind a small, server-only Next adapter. */
async function dispatch(request: NextRequest): Promise<NextResponse> {
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
  const url = new URL(request.url);
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
  const response = {
    statusCode: 200,
    headers: new Headers(),
    body: '',
    status(code: number) { this.statusCode = code; return this; },
    setHeader(name: string, value: string | string[]) { this.headers.set(name, Array.isArray(value) ? value.join(', ') : value); return this; },
    json(value: unknown) { this.headers.set('Content-Type', 'application/json'); this.body = JSON.stringify(value); return this; },
    send(value: unknown) { this.body = typeof value === 'string' ? value : JSON.stringify(value); return this; },
    end() { return this; },
  };
  const req = { method: request.method, headers, body, query: Object.fromEntries(url.searchParams) } as any;
  await handler(req, response as any);
  return new NextResponse(response.body, { status: response.statusCode, headers: response.headers });
}

export const GET = dispatch;
export const POST = dispatch;
export const OPTIONS = dispatch;
