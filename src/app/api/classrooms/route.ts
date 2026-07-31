import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const classrooms = await prisma.classroom.findMany({
      where: { teacherId: DEMO_TEACHER_ID },
      include: { students: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(classrooms)
  } catch (error) {
    console.error('Failed to fetch classrooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classrooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subject, grade, period, color } = body

    if (!name || !subject || !grade) {
      return NextResponse.json(
        { error: 'Name, subject, and grade are required' },
        { status: 400 }
      )
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        subject,
        grade,
        period: period || null,
        color: color || '#dd9a33',
        teacherId: DEMO_TEACHER_ID,
      },
      include: { students: true },
    })

    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    console.error('Failed to create classroom:', error)
    return NextResponse.json(
      { error: 'Failed to create classroom' },
      { status: 500 }
    )
  }
}
