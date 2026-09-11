import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const targetUrl = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';

  try {
    // Attempt 1: Direct Fetch
    let response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    // Attempt 2: Fallback to Proxy if Direct Fetch is blocked (e.g. 403 Forbidden)
    if (!response.ok) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      response = await fetch(proxyUrl, { cache: 'no-store' });
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch data from both sources. Status: ${response.status}`);
    }
    
    // Catch HTML Cloudflare pages that try to masquerade as JSON
    const textData = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      throw new Error('Received HTML instead of JSON (Blocked by Cloudflare)');
    }

    return NextResponse.json(jsonData);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
