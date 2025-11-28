import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'

export async function POST() {
  await deleteSession()

  // Redirect user to homepage or login page after logout
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
}
