import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { createSession } from '@/lib/session'
import User from '@/models/User'
import bcrypt from 'bcrypt'     
// POST /api/auth/login
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await dbConnect() // make sure you're connected to Mongo

    // find the user in the database
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // check password using bcrypt
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ create session
    await createSession(user._id.toString())

    return NextResponse.json({ message: 'Login successful' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
