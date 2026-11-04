import { NextResponse } from 'next/server'
import { prisma, DEMO_TEACHER_ID } from '@/lib/db'

export async function GET() {
  try {
    const [totalLessons, totalMaterials, analyticsData, recentLessons] =
      await Promise.all([
        prisma.lesson.count({
          where: { course: { teacherId: DEMO_TEACHER_ID } },
        }),
        prisma.material.count({
          where: { lesson: { course: { teacherId: DEMO_TEACHER_ID } } },
        }),
        prisma.lessonAnalytics.aggregate({
          where: { lesson: { course: { teacherId: DEMO_TEACHER_ID } } },
          _avg: {
            engagementScore: true,
            completionRate: true,
            avgScore: true,
          },
        }),
        prisma.lesson.findMany({
          where: { course: { teacherId: DEMO_TEACHER_ID } },
          orderBy: { updatedAt: 'desc' },
          take: 10,
          include: {
            course: { select: { title: true, subject: true } },
            analytics: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        }),
      ])

    const avgEngagement = analyticsData._avg.engagementScore || 0
    const avgCompletionRate = analyticsData._avg.completionRate || 0
    const avgScore = analyticsData._avg.avgScore || 0

    const recentActivity = recentLessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      course: lesson.course.title,
      subject: lesson.course.subject,
      status: lesson.status,
      updatedAt: lesson.updatedAt,
      engagement: lesson.analytics[0]?.engagementScore || null,
    }))

    return NextResponse.json({
      totalLessons,
      totalMaterials,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
      avgScore: Math.round(avgScore * 100) / 100,
      recentActivity,
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
