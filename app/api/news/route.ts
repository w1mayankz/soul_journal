import { NextResponse } from 'next/server';

// Tell Next.js to cache this route for 1800 seconds (30 minutes)
export const revalidate = 1800;

export async function GET() {
  const targetUrl = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';
  
  // A list of fallback routes: Direct -> Proxy 1 -> Proxy 2
  const fetchUrls = [
    targetUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${targetUrl}`
  ];

  for (const url of fetchUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        // Cache the fetch itself for 30 minutes
        next: { revalidate: 1800 } 
      });

      if (!response.ok) continue; // If blocked, move to the next URL
      
      const textData = await response.text();
      const jsonData = JSON.parse(textData); // This will purposefully fail if Cloudflare returns an HTML security page
      
      return NextResponse.json(jsonData);
      
    } catch (error) {
      // Silently catch the error and let the loop try the next proxy url
      continue;
    }
  }

  // If ALL proxies fail, return a clean error
  return NextResponse.json(
    { error: "Data source temporarily blocked by Cloudflare. Data will refresh shortly." }, 
    { status: 500 }
  );
}
