export interface Teacher {
  id: string
  name: string
  email: string
  subject?: string
  grade?: string
}

export interface Course {
  id: string
  title: string
  description?: string
  subject: string
  grade: string
  color: string
  teacherId: string
  lessonCount?: number
  createdAt: string
}

export interface Lesson {
  id: string
  title: string
  objective?: string
  content?: string
  duration: number
  status: 'draft' | 'published' | 'archived'
  courseId: string
  courseName?: string
  createdAt: string
}

export interface Material {
  id: string
  type: 'lesson_plan' | 'quiz' | 'worksheet' | 'activity'
  title: string
  content: string
  lessonId: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolResults?: ToolResult[]
  timestamp: Date
}

export interface ToolResult {
  type: string
  data: Record<string, unknown>
}

export type TeachingMode = 'general' | 'lesson' | 'quiz' | 'worksheet' | 'activity'
