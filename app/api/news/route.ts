import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevents Next.js from caching the API response

export async function GET() {
  try {
    // A fake User-Agent ensures Forex Factory doesn't block the request
    const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Failed to fetch from Forex Factory');
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
