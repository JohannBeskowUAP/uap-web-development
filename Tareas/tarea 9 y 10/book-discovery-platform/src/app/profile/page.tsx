import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!payload) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, user {payload.userId}</h1>
      <form action="/api/logout" method="post">
        <button>Logout</button>
      </form>
    </div>
  )
}
