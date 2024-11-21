import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const clinicSlug = pathname.split('/')[1];

  console.log('Middleware - Path:', pathname, 'Token:', !!token);

  // Public paths that don't require authentication
  const publicPaths = ['/_next', '/api', '/favicon.ico', '/images'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Root path handling
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Login page handling
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL(`/${clinicSlug}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes handling
  if (pathname.includes('/dashboard')) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
