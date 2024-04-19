import type { NextRequest } from 'next/server';
 
export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.APP_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
 
  return Response.json({ success: true });
}