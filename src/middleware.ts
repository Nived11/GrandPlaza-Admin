import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtRole } from '@/utils/jwtHelper';

export async function middleware(request: NextRequest) {
  const accessToken = 
    request.cookies.get('access_token')?.value || 
    request.cookies.get('access')?.value;

  const refreshToken = 
    request.cookies.get('refresh_token')?.value || 
    request.cookies.get('refresh')?.value;

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login';

  // 🔒 1. Cryptographically verify signature and extract Role from JWT token
  let userRole: string | null = null;
  if (accessToken) {
    userRole = await verifyJwtRole(accessToken);
  }
  if (!userRole && refreshToken) {
    userRole = await verifyJwtRole(refreshToken);
  }

  const isStaffOrAdmin = userRole === 'admin' || userRole === 'employee';
  const isAuthenticated = Boolean(isStaffOrAdmin);

  // 1. Not Authenticated OR Not Staff/Admin -> Redirect to Login
  if (!isLoginPage) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Authenticated Staff/Admin & Trying to access Login -> Redirect
  if (isAuthenticated && isLoginPage) {
    const defaultRoute = userRole === 'employee' ? '/orders' : '/';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 🔒 3. Role Protection: If Kitchen Staff (employee) tries to access ANY Admin-Only pages
  if (userRole === 'employee') {
    const employeeAllowedPrefixes = ['/orders', '/menu'];
    const isAllowed = employeeAllowedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/orders', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
