import { NextResponse } from 'next/server'
import { createSession } from '@/lib/session'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Pretend we created the user in DB
  const user = { id: 'user-123', email }

  await createSession(user.id)

  return NextResponse.json({ message: 'User created' })
}
