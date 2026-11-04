import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession, DEMO_TEACHER_ID } from '@/lib/auth'

const DEMO_USER = {
  id: DEMO_TEACHER_ID,
  name: 'Demo Teacher',
  email: 'demo@taleeko.ai',
  role: 'TEACHER',
  avatar: null,
}

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Return mock user for demo sessions without hitting the database
  if (session.userId.startsWith('demo_')) {
    return NextResponse.json({ user: { ...DEMO_USER, id: session.userId } })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
