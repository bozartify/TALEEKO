import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let where: Record<string, unknown> = { teacherId: DEMO_TEACHER_ID }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      where = {
        ...where,
        date: {
          gte: startDate,
          lte: endDate,
        },
      }
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, endDate, type, color } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      )
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        type: type || 'class',
        color: color || '#6366f1',
        teacherId: DEMO_TEACHER_ID,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}
