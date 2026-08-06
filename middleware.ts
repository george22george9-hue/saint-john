import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /api/admin/* endpoints
  if (pathname.startsWith('/api/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token && !bearerToken) {
      return NextResponse.json({ error: 'Access denied. No token provided.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
