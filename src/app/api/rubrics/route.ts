import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const rubrics = await prisma.rubric.findMany({
      where: { teacherId: DEMO_TEACHER_ID },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(rubrics)
  } catch (error) {
    console.error('Failed to fetch rubrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rubrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subject, grade, criteria, levels } = body

    if (!title || !subject || !grade || !criteria) {
      return NextResponse.json(
        { error: 'Title, subject, grade, and criteria are required' },
        { status: 400 }
      )
    }

    const rubric = await prisma.rubric.create({
      data: {
        title,
        subject,
        grade,
        criteria: typeof criteria === 'string' ? criteria : JSON.stringify(criteria),
        levels: levels || 4,
        teacherId: DEMO_TEACHER_ID,
      },
    })

    return NextResponse.json(rubric, { status: 201 })
  } catch (error) {
    console.error('Failed to create rubric:', error)
    return NextResponse.json(
      { error: 'Failed to create rubric' },
      { status: 500 }
    )
  }
}
