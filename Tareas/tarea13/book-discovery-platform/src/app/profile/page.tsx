import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import connectDB from '@/lib/dbConnect'
import User from '@/models/User'

export default async function ProfilePage() {
  // 1️⃣ Get session from cookie
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!payload) {
    redirect('/login') // Not logged in
  }

  // 2️⃣ Connect to DB
  await connectDB()

  // 3️⃣ Fetch user by ID
  const user = await User.findById(payload.userId).select('email')
  if (!user) {
    redirect('/login') // Invalid session
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <form action="/api/auth/logout" method="post">
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
          Logout
        </button>
      </form>
    </div>
  )
}
