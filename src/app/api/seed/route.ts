import { NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function POST() {
  try {
    const teacher = await prisma.user.upsert({
      where: { id: DEMO_TEACHER_ID },
      update: {},
      create: {
        id: DEMO_TEACHER_ID,
        email: 'demo@teachweaver.ai',
        name: 'Alex Johnson',
        role: 'teacher',
      },
    })

    const course = await prisma.course.upsert({
      where: { id: 'demo_course_001' },
      update: {},
      create: {
        id: 'demo_course_001',
        title: '7th Grade Biology',
        description: 'Life science, cells, ecosystems, and genetics',
        subject: 'Science',
        grade: '7th',
        color: '#8b5cf6',
        teacherId: DEMO_TEACHER_ID,
      },
    })

    const lessons = await Promise.all([
      prisma.lesson.upsert({
        where: { id: 'demo_lesson_001' },
        update: {},
        create: {
          id: 'demo_lesson_001',
          title: 'Introduction to Cells',
          objective: 'Students will understand the basic structure of cells',
          duration: 45,
          status: 'published',
          courseId: 'demo_course_001',
        },
      }),
      prisma.lesson.upsert({
        where: { id: 'demo_lesson_002' },
        update: {},
        create: {
          id: 'demo_lesson_002',
          title: 'Photosynthesis',
          objective: 'Students will explain the process of photosynthesis',
          duration: 60,
          status: 'published',
          courseId: 'demo_course_001',
        },
      }),
    ])

    return NextResponse.json({ success: true, teacher, course, lessons })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Seed failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
