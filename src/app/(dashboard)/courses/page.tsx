'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Plus, MoreHorizontal, ChevronRight, Clock, FileText } from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const courses = [
  {
    id: '1', title: '7th Grade Biology', subject: 'Science', grade: '7th',
    color: '#b0623f', lessons: 12, description: 'Life science, cells, ecosystems, and genetics',
    lastUpdated: 'Today'
  },
  {
    id: '2', title: 'American History 8', subject: 'History', grade: '8th',
    color: '#f97316', lessons: 9, description: 'Colonial era through Reconstruction',
    lastUpdated: 'Yesterday'
  },
  {
    id: '3', title: 'Algebra I', subject: 'Mathematics', grade: '9th',
    color: '#14b8a6', lessons: 15, description: 'Linear equations, systems, and functions',
    lastUpdated: '2 days ago'
  },
  {
    id: '4', title: 'English Literature 10', subject: 'English', grade: '10th',
    color: '#f43f5e', lessons: 8, description: 'Classic and contemporary literature analysis',
    lastUpdated: '1 week ago'
  },
]

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-400">{courses.length} courses</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              New Course
            </button>
          </motion.div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Link href={`/courses/${course.id}`} className="glass-card overflow-hidden group block">
              <div className="h-1.5" style={{ backgroundColor: course.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: course.color + '20' }}>
                      <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors">{course.title}</h3>
                      <p className="text-xs text-surface-500">{course.subject} · Grade {course.grade}</p>
                    </div>
                  </div>
                  <button className="text-surface-500 hover:text-surface-300" onClick={e => e.preventDefault()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-surface-400 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.lastUpdated}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
