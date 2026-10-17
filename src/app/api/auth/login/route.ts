import { NextResponse } from 'next/server'
import { createSession, DEMO_TEACHER_ID } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Demo mode: accept any email with password "demo" or "demo123",
    // or email "demo@taleeko.ai" with any password
    const isDemoLogin =
      password === 'demo' ||
      password === 'demo123' ||
      email === 'demo@taleeko.ai'

    if (!isDemoLogin) {
      return NextResponse.json(
        { error: 'Invalid credentials. Use demo mode: any email with password "demo" or "demo123"' },
        { status: 401 }
      )
    }

    // Demo mode: create session directly without DB (no DATABASE_URL required)
    const userId = email === 'demo@taleeko.ai' ? DEMO_TEACHER_ID : `demo_${email.replace(/[^a-z0-9]/gi, '_')}`
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

    await createSession(userId)

    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
        role: 'teacher',
        avatar: null,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
