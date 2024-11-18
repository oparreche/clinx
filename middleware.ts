import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constants
const SESSION_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

// Role-based access configuration
const ROLE_ACCESS = {
  admin: [
    'dashboard',
    'agendamentos',
    'psicologos',
    'pacientes',
    'funcionarios',
    'servicos',
    'lembretes',
    'financeiro',
    'configuracoes'
  ],
  doctor: [
    'medico',
    'agendamentos',
    'pacientes',
    'lembretes'
  ],
  patient: [
    'paciente',
    'agendamentos',
    'lembretes'
  ]
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignore Next.js internal routes and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const slug = segments[1];
  const currentPath = segments[2];

  // If no slug, allow access
  if (!slug) {
    return NextResponse.next();
  }

  // Ajusta os caminhos públicos para incluir o slug
  const adjustedPublicPaths = PUBLIC_PATHS.map(path => `/${slug}${path}`);

  // Permite acesso aos caminhos públicos
  if (adjustedPublicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('auth_token');

  // Checa autenticação para rotas protegidas
  if (!authCookie) {
    return NextResponse.redirect(new URL(`/${slug}/login`, request.url));
  }

  try {
    const { user, clinicSlug, timestamp } = JSON.parse(authCookie.value);
    const isSessionValid = Date.now() - timestamp < SESSION_TIMEOUT;

    // Check if user is trying to access a different clinic
    if (clinicSlug && clinicSlug !== slug) {
      return NextResponse.redirect(new URL(`/${clinicSlug}/dashboard`, request.url));
    }

    if (!isSessionValid) {
      const response = NextResponse.redirect(new URL(`/${slug}/login`, request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    // Verifica se o usuário tem acesso à rota atual
    const allowedPaths = ROLE_ACCESS[user.role as keyof typeof ROLE_ACCESS] || [];
    if (currentPath && !allowedPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL(`/${slug}/unauthorized`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL(`/${slug}/login`, request.url));
    response.cookies.delete('auth_token');
    return response;
  }
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
};
