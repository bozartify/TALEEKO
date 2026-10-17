import { NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: DEMO_TEACHER_ID },
      include: { _count: { select: { lessons: true } } },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(courses)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch courses'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
        subject: body.subject,
        grade: body.grade,
        color: body.color ?? '#8b5cf6',
        teacherId: DEMO_TEACHER_ID,
      },
    })
    return NextResponse.json(course)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create course'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
