import { NextRequest, NextResponse } from 'next/server';

const BITREFILL_API = 'https://api.bitrefill.com/v2';
const ALLOWED_PREFIXES = ['products', 'invoices', 'orders', 'accounts', 'ping'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const apiKey = process.env.BITREFILL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathStr = path.join('/');

  if (!ALLOWED_PREFIXES.some(p => pathStr.startsWith(p))) {
    return NextResponse.json({ error: 'Invalid API path' }, { status: 403 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const targetUrl = `${BITREFILL_API}/${pathStr}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json(
        { error: text || 'Invalid response from Bitrefill API' },
        { status: response.status || 502 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Bitrefill API' }, { status: 502 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const apiKey = process.env.BITREFILL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { path } = await params;
  const pathStr = path.join('/');

  if (!ALLOWED_PREFIXES.some(p => pathStr.startsWith(p))) {
    return NextResponse.json({ error: 'Invalid API path' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const response = await fetch(`${BITREFILL_API}/${pathStr}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json(
        { error: text || 'Invalid response from Bitrefill API' },
        { status: response.status || 502 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Bitrefill API' }, { status: 502 });
  }
}
