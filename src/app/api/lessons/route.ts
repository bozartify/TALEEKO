import { NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { course: { teacherId: DEMO_TEACHER_ID } },
      include: { course: { select: { title: true, subject: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(lessons)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch lessons'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lesson = await prisma.lesson.create({
      data: {
        title: body.title,
        objective: body.objective,
        content: body.content,
        duration: body.duration ?? 45,
        status: body.status ?? 'draft',
        courseId: body.courseId,
      },
    })
    return NextResponse.json(lesson)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create lesson'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
