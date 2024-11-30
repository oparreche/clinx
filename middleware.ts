import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const clinicSlug = request.cookies.get('clinicSlug')?.value;
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split('/');
  const urlClinicSlug = pathSegments[2]; // Mudado de [1] para [2] devido ao /c/

  console.log('Middleware - Path:', pathname, 'Token:', !!token, 'ClinicSlug:', clinicSlug);

  // Public paths that don't require authentication
  const publicPaths = ['/_next', '/api', '/favicon.ico', '/images', '/login', '/c/login'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Root path handling
  if (pathname === '/') {
    if (token && clinicSlug) {
      return NextResponse.redirect(new URL(`/c/${clinicSlug}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Clinic-specific login page handling
  if (pathname.endsWith('/login')) {
    if (token && clinicSlug) {
      return NextResponse.redirect(new URL(`/c/${clinicSlug}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes handling
  if (!token || !clinicSlug) {
    console.log('No token or clinic slug found, redirecting to login');
    const loginPath = urlClinicSlug ? `/c/${urlClinicSlug}/login` : '/login';
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Ensure user is accessing their assigned clinic
  if (urlClinicSlug && urlClinicSlug !== clinicSlug) {
    console.log('Clinic slug mismatch, redirecting to correct clinic');
    return NextResponse.redirect(new URL(`/c/${clinicSlug}/dashboard`, request.url));
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
