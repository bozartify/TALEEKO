import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const DEMO_TEACHER_ID = 'demo_teacher_001'

export async function ensureDemoTeacher() {
  return prisma.user.upsert({
    where: { id: DEMO_TEACHER_ID },
    update: {},
    create: {
      id: DEMO_TEACHER_ID,
      email: 'demo@taleeko.ai',
      name: 'Alex Johnson',
      role: 'teacher',
    },
  })
}

export interface ParsedLesson {
  id: string
  title: string
  objective: string | null
  content: string | null
  duration: number
  status: string
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export interface ParsedCourse {
  id: string
  title: string
  description: string | null
  subject: string
  grade: string
  color: string
  teacherId: string
  createdAt: Date
  updatedAt: Date
}
