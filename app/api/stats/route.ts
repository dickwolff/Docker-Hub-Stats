import prismadb from '@/lib/prismadb';
import type { NextRequest } from 'next/server';
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.APP_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
 
  const pullData = await prismadb.pullData.findMany();

  return Response.json({ success: true, data: pullData });
}