import { NextResponse } from 'next/server';

export function middleware(request) {
  const userData = request.cookies.get('userData');

  if (typeof userData === 'object') {
    const userRole = JSON.parse(userData?.value)?.role;

    if (
      (request.nextUrl.pathname.startsWith('/cp') && userRole !== 'cp') ||
      (request.nextUrl.pathname.startsWith('/client') && userRole !== 'user') ||
      (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}
