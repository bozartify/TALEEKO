import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId query parameter is required' },
        { status: 400 }
      )
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { studentId },
      include: { student: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Failed to fetch portfolio entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, title, type, score, feedback } = body

    if (!studentId || !title || !type) {
      return NextResponse.json(
        { error: 'studentId, title, and type are required' },
        { status: 400 }
      )
    }

    const entry = await prisma.portfolio.create({
      data: {
        studentId,
        title,
        type,
        score: score !== undefined ? score : null,
        feedback: feedback || null,
      },
      include: { student: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Failed to create portfolio entry:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio entry' },
      { status: 500 }
    )
  }
}
