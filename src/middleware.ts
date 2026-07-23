import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAccessToken = 
    request.cookies.get('access_token')?.value || 
    request.cookies.get('access')?.value;

  const hasRefreshToken = 
    request.cookies.get('refresh_token')?.value || 
    request.cookies.get('refresh')?.value;

  const isAuthenticated = Boolean(hasAccessToken || hasRefreshToken);

  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};