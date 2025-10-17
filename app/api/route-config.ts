import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// Utility to enable route caching with revalidation
export function withRouteCache(handler: (req: NextRequest) => Promise<Response>, options = { revalidate: 60 }) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const response = await handler(req);
    
    // Only cache GET requests
    if (req.method === 'GET') {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', `s-maxage=${options.revalidate}, stale-while-revalidate`);
      
      return new NextResponse(response.body, {
        ...response,
        headers
      });
    }
    
    return response;
  };
}

// Utility for incremental static regeneration
export function withISR(handler: (req: NextRequest) => Promise<Response>, options = { revalidate: 3600 }) {
  return async (req: NextRequest) => {
    const response = await handler(req);
    
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', `public, s-maxage=1, stale-while-revalidate=${options.revalidate}`);
    
    return new NextResponse(response.body, {
      ...response,
      headers
    });
  };
}
