import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const payload = await decrypt(session)

  // Redirect if not logged in
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',               // homepage
    '/favorites',      // favorites page
    '/profile/:path*', // profile and subroutes
    '/modules/:path*', // protect modules pages too
  ],
}
