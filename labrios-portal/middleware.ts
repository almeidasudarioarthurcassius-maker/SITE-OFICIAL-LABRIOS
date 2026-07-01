// middleware.ts (na raiz do projeto)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    const session = req.cookies.get('ltip_admin_session');
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
