'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, MoreHorizontal, Clock, FileText, Sparkles,
  Search, Users, BarChart2, GraduationCap, LayoutGrid, List,
  ChevronDown, Filter
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

type ViewMode = 'grid' | 'list'
type SubjectFilter = 'All' | 'Science' | 'Math' | 'History' | 'English' | 'Art'
type SortOption = 'recent' | 'a-z' | 'most-lessons'

interface Course {
  id: string
  title: string
  subject: string
  grade: string
  color: string
  lessons: number
  students: number
  completion: number
  description: string
  lastUpdated: string
  status: 'active' | 'draft'
}

const courses: Course[] = [
  {
    id: '1', title: '7th Grade Biology', subject: 'Science', grade: '7th',
    color: '#8b5cf6', lessons: 12, students: 28, completion: 75,
    description: 'Life science covering cells, ecosystems, genetics, and the diversity of living organisms.',
    lastUpdated: 'Today', status: 'active',
  },
  {
    id: '2', title: 'American History 8', subject: 'History', grade: '8th',
    color: '#f97316', lessons: 9, students: 24, completion: 60,
    description: 'Colonial era through Reconstruction, including key events, figures, and social movements.',
    lastUpdated: 'Yesterday', status: 'active',
  },
  {
    id: '3', title: 'Algebra I', subject: 'Math', grade: '9th',
    color: '#14b8a6', lessons: 15, students: 30, completion: 85,
    description: 'Linear equations, inequalities, systems of equations, and introduction to functions.',
    lastUpdated: '2 days ago', status: 'active',
  },
  {
    id: '4', title: 'English Literature 10', subject: 'English', grade: '10th',
    color: '#f43f5e', lessons: 8, students: 22, completion: 45,
    description: 'Classic and contemporary literature analysis with focus on critical reading and writing.',
    lastUpdated: '3 days ago', status: 'active',
  },
  {
    id: '5', title: 'Earth Science 6', subject: 'Science', grade: '6th',
    color: '#06b6d4', lessons: 10, students: 26, completion: 90,
    description: 'Geology, weather systems, plate tectonics, and the water cycle.',
    lastUpdated: '4 days ago', status: 'active',
  },
  {
    id: '6', title: 'Creative Writing', subject: 'English', grade: '11th',
    color: '#ec4899', lessons: 6, students: 18, completion: 30,
    description: 'Fiction, poetry, and narrative techniques with peer workshop sessions.',
    lastUpdated: '5 days ago', status: 'active',
  },
  {
    id: '7', title: 'Geometry', subject: 'Math', grade: '10th',
    color: '#22c55e', lessons: 11, students: 32, completion: 55,
    description: 'Shapes, proofs, congruence, similarity, and coordinate geometry fundamentals.',
    lastUpdated: '1 week ago', status: 'active',
  },
  {
    id: '8', title: 'World Geography', subject: 'History', grade: '6th',
    color: '#f59e0b', lessons: 7, students: 20, completion: 0,
    description: 'Physical and human geography across continents, cultures, and environments.',
    lastUpdated: '2 weeks ago', status: 'draft',
  },
]

const subjectFilters: SubjectFilter[] = ['All', 'Science', 'Math', 'History', 'English', 'Art']

const stats = [
  { label: 'Total Courses', value: '8', icon: BookOpen, color: '#8b5cf6' },
  { label: 'Active Students', value: '142', icon: Users, color: '#14b8a6' },
  { label: 'Lessons Created', value: '78', icon: FileText, color: '#f97316' },
  { label: 'Avg Completion', value: '73%', icon: BarChart2, color: '#ec4899' },
]

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('All')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filtered = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = !search.trim() || course.title.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = subjectFilter === 'All' || course.subject === subjectFilter
      return matchesSearch && matchesSubject
    })

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'a-z': return a.title.localeCompare(b.title)
        case 'most-lessons': return b.lessons - a.lessons
        default: return 0
      }
    })

    return result
  }, [search, subjectFilter, sortBy])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">My Courses</h2>
              <p className="text-xs text-surface-400">{courses.length} courses in your collection</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <button className="btn-gradient">
                <Sparkles className="w-4 h-4" />
                AI Create Course
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <button className="btn-secondary">
                <Plus className="w-4 h-4" />
                New Course
              </button>
            </motion.div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}18` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-white leading-tight">{stat.value}</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Search & Filter Bar */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-10"
            />
          </div>

          {/* Subject filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value as SubjectFilter)}
              className="input-base pl-9 pr-8 appearance-none cursor-pointer min-w-[140px]"
            >
              {subjectFilters.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="input-base pr-8 appearance-none cursor-pointer min-w-[130px]"
            >
              <option value="recent">Recent</option>
              <option value="a-z">A-Z</option>
              <option value="most-lessons">Most Lessons</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.03]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-accent-500/15 text-accent-400'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-white/[0.04]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-accent-500/15 text-accent-400'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-white/[0.04]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Course Grid / List */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="glass-card p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
              <Search className="w-7 h-7 text-surface-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No courses found</h3>
            <p className="text-sm text-surface-400 mb-4">
              No courses match your current filters.
            </p>
            <button
              onClick={() => { setSearch(''); setSubjectFilter('All') }}
              className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link href={`/courses/${course.id}`} className="glass-card overflow-hidden group block">
                  {/* Color accent bar */}
                  <div className="h-1.5" style={{ backgroundColor: course.color }} />

                  <div className="p-5">
                    {/* Header: icon + title + more button */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: course.color + '20' }}
                        >
                          <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors truncate">
                            {course.title}
                          </h3>
                          <p className="text-xs text-surface-500">
                            {course.subject} · Grade {course.grade}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`badge ${
                          course.status === 'active'
                            ? 'bg-success-400/15 text-success-400'
                            : 'bg-white/[0.06] text-surface-400'
                        }`}>
                          {course.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                        <button
                          className="text-surface-500 hover:text-surface-300 transition-colors"
                          onClick={e => e.preventDefault()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-surface-400 mb-4 line-clamp-2">{course.description}</p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Progress</span>
                        <span className="text-xs font-bold" style={{ color: course.color }}>{course.completion}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: course.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${course.completion}%` }}
                          transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-surface-500 pt-3 border-t border-white/[0.06]">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students} students
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {course.lastUpdated}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            key="list"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.18 } }}
              >
                <Link href={`/courses/${course.id}`} className="glass-card overflow-hidden group block">
                  <div className="flex items-center">
                    {/* Color accent - vertical bar for list mode */}
                    <div className="w-1 self-stretch flex-shrink-0" style={{ backgroundColor: course.color }} />

                    <div className="flex-1 flex items-center gap-4 px-5 py-4">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: course.color + '20' }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                      </div>

                      {/* Title + subject */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors truncate text-sm">
                          {course.title}
                        </h3>
                        <p className="text-xs text-surface-500">{course.subject} · Grade {course.grade}</p>
                      </div>

                      {/* Progress */}
                      <div className="hidden sm:flex items-center gap-2 w-32 flex-shrink-0">
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: course.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${course.completion}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                          />
                        </div>
                        <span className="text-xs font-bold w-8 text-right" style={{ color: course.color }}>
                          {course.completion}%
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-4 text-xs text-surface-500 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {course.lessons}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.lastUpdated}
                        </span>
                      </div>

                      {/* Badge + more */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge ${
                          course.status === 'active'
                            ? 'bg-success-400/15 text-success-400'
                            : 'bg-white/[0.06] text-surface-400'
                        }`}>
                          {course.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                        <button
                          className="text-surface-500 hover:text-surface-300 transition-colors"
                          onClick={e => e.preventDefault()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
