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

  // 🔒 1. Extract Role directly from JWT Access Token Payload
  let userRole: string | null = null;
  if (accessToken) {
    userRole = decodeJwtRole(accessToken);
  }

  // Fallback if access token is missing or invalid
  if (!userRole) {
    userRole = request.cookies.get('user_role')?.value ?? null;
  }

  const isStaffOrAdmin = userRole === 'admin' || userRole === 'employee';

  // 1. Not Authenticated OR Not Staff/Admin -> Redirect to Login
  if (!isLoginPage) {
    if (!isAuthenticated || !isStaffOrAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Authenticated Staff/Admin & Trying to access Login -> Redirect to Dashboard
  if (isAuthenticated && isStaffOrAdmin && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🔒 3. Role Protection: If Employee tries to access Admin-Only pages directly
  const adminOnlyPaths = ['/customers', '/revenue', '/employees', '/settings'];
  if (userRole === 'employee' && adminOnlyPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};