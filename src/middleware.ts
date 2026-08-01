import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwtRole } from '@/utils/jwtHelper';

export function middleware(request: NextRequest) {
  const accessToken = 
    request.cookies.get('access_token')?.value || 
    request.cookies.get('access')?.value;

  const refreshToken = 
    request.cookies.get('refresh_token')?.value || 
    request.cookies.get('refresh')?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login';

  // 1. Not Authenticated -> Redirect to Login
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Authenticated & Trying to access Login -> Redirect to Home
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🔒 3. Extract Role directly from JWT Access Token Payload
  let userRole: string | null = null;
  if (accessToken) {
    userRole = decodeJwtRole(accessToken);
  }

  // Fallback if access token is missing or invalid
  if (!userRole) {
    userRole = request.cookies.get('user_role')?.value ?? null;
  }

  // 🔒 4. Role Protection: If Employee tries to access Admin-Only pages directly
  const adminOnlyPaths = ['/customers', '/revenue', '/employees', '/settings'];
  if (isAuthenticated && userRole === 'employee' && adminOnlyPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};