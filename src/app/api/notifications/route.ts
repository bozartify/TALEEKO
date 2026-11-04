import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: DEMO_TEACHER_ID },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId: DEMO_TEACHER_ID,
        title,
        message,
        type: type || 'info',
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Notification id is required' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: read !== undefined ? read : true },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Failed to update notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
