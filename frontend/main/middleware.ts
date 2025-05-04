import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add the paths that need authentication
const protectedPaths = [
  '/additonal_infomration',
  '/profile',
  '/orders',
  '/cart',
  '/checkout'
];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')
  const idToken = request.cookies.get('id_token')

  // Check if the path needs authentication
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && (!currentUser || !idToken)) {
    // Redirect to login if accessing protected route without auth
    const response = NextResponse.redirect(new URL('/login', request.url))
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/additonal_infomration/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/cart/:path*',
    '/checkout/:path*',
  ],
}
