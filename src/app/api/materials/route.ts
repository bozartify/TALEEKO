import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const material = await prisma.material.create({
      data: {
        type: body.type,
        title: body.title,
        content: typeof body.content === 'string' ? body.content : JSON.stringify(body.content),
        lessonId: body.lessonId,
      },
    })
    return NextResponse.json(material)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save material'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const materials = await prisma.material.findMany({
      where: lessonId ? { lessonId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(materials)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch materials'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
