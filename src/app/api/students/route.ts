import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const where = classId ? { classId } : {}

    const students = await prisma.student.findMany({
      where,
      include: { class: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, grade, avatar, classId } = body

    if (!name || !grade) {
      return NextResponse.json(
        { error: 'Name and grade are required' },
        { status: 400 }
      )
    }

    const student = await prisma.student.create({
      data: {
        name,
        email: email || null,
        grade,
        avatar: avatar || null,
        classId: classId || null,
      },
      include: { class: true },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Failed to create student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
