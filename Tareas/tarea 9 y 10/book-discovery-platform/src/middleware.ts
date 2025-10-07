import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const payload = await decrypt(session)

  // Protect all pages under /dashboard or /profile
  if (!payload && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

// Apply only to protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
