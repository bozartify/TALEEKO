import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession, DEMO_TEACHER_ID } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Demo mode: accept any email with password "demo" or "demo123",
    // or email "demo@teachweaver.ai" with any password
    const isDemoLogin =
      password === 'demo' ||
      password === 'demo123' ||
      email === 'demo@teachweaver.ai'

    if (!isDemoLogin) {
      return NextResponse.json(
        { error: 'Invalid credentials. Use demo mode: any email with password "demo" or "demo123"' },
        { status: 401 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // For demo@teachweaver.ai, use the known demo teacher ID
      const id = email === 'demo@teachweaver.ai' ? DEMO_TEACHER_ID : undefined
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

      user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          ...(id ? { id } : {}),
          email,
          name,
          role: 'teacher',
        },
      })
    }

    // Create session
    await createSession(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
