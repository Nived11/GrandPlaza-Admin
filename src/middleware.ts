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
  if (!userRole && refreshToken) {
    userRole = decodeJwtRole(refreshToken);
  }

  // Fallback if token decode fails
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

  // 2. Authenticated Staff/Admin & Trying to access Login -> Redirect
  if (isAuthenticated && isStaffOrAdmin && isLoginPage) {
    const defaultRoute = userRole === 'employee' ? '/orders' : '/';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 🔒 3. Role Protection: If Kitchen Staff (employee) tries to access ANY Admin-Only pages
  // Kitchen Staff are strictly restricted to Live Orders (/orders) and Menu (/menu)
  if (userRole === 'employee') {
    const employeeAllowedPrefixes = ['/orders', '/menu'];
    const isAllowed = employeeAllowedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (!isAllowed) {
      // Immediately bounce employee to /orders
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