'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, MoreHorizontal, Clock, FileText, Sparkles,
  Search, Users, BarChart2, GraduationCap, LayoutGrid, List,
  ChevronDown, Filter, AlertCircle, TrendingUp, X,
  Check, Edit, Copy, Archive, Trash2, BarChart3, Star, Zap,
  Calendar, Bell, Eye, Download
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type ViewMode = 'grid' | 'list'
type SubjectFilter = 'All' | 'Science' | 'Math' | 'History' | 'English' | 'Art'
type SortOption = 'recent' | 'a-z' | 'most-lessons' | 'completion'

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
  status: 'active' | 'draft' | 'archived'
  nextMilestone?: string
}

const COURSES: Course[] = [
  { id: '1', title: '7th Grade Biology',    subject: 'Science',  grade: '7th',  color: '#8b5cf6', lessons: 12, students: 28, completion: 75, description: 'Life science covering cells, ecosystems, genetics, and the diversity of living organisms.',              lastUpdated: 'Today',      status: 'active',   nextMilestone: 'Genetics Unit starts Oct 14' },
  { id: '2', title: 'American History 8',   subject: 'History',  grade: '8th',  color: '#f97316', lessons: 9,  students: 24, completion: 60, description: 'Colonial era through Reconstruction, including key events, figures, and social movements.',             lastUpdated: 'Yesterday',  status: 'active',   nextMilestone: 'Primary Source Analysis Oct 18' },
  { id: '3', title: 'Algebra I',            subject: 'Math',     grade: '9th',  color: '#14b8a6', lessons: 15, students: 30, completion: 85, description: 'Linear equations, inequalities, systems of equations, and introduction to functions.',               lastUpdated: '2 days ago', status: 'active' },
  { id: '4', title: 'English Literature 10',subject: 'English',  grade: '10th', color: '#f43f5e', lessons: 8,  students: 22, completion: 45, description: 'Classic and contemporary literature analysis with focus on critical reading and writing.',              lastUpdated: '3 days ago', status: 'active',   nextMilestone: 'Essay Drafts due Oct 20' },
  { id: '5', title: 'Earth Science 6',      subject: 'Science',  grade: '6th',  color: '#06b6d4', lessons: 10, students: 26, completion: 90, description: 'Geology, weather systems, plate tectonics, and the water cycle.',                                    lastUpdated: '4 days ago', status: 'active' },
  { id: '6', title: 'Creative Writing',     subject: 'English',  grade: '11th', color: '#ec4899', lessons: 6,  students: 18, completion: 30, description: 'Fiction, poetry, and narrative techniques with peer workshop sessions.',                              lastUpdated: '5 days ago', status: 'active',   nextMilestone: 'Workshop Session Oct 16' },
  { id: '7', title: 'Geometry',             subject: 'Math',     grade: '10th', color: '#22c55e', lessons: 11, students: 32, completion: 55, description: 'Shapes, proofs, congruence, similarity, and coordinate geometry fundamentals.',                      lastUpdated: '1 week ago', status: 'active' },
  { id: '8', title: 'World Geography',      subject: 'History',  grade: '6th',  color: '#f59e0b', lessons: 7,  students: 20, completion: 0,  description: 'Physical and human geography across continents, cultures, and environments.',                        lastUpdated: '2 weeks ago',status: 'draft' },
]

const RECENT_ACTIVITY = [
  { text: 'Quiz added to Algebra I', time: '1h ago', icon: FileText, color: '#14b8a6' },
  { text: '3 new students joined Earth Science 6', time: '2h ago', icon: Users, color: '#06b6d4' },
  { text: 'Assignment due reminder: 7th Grade Biology', time: '4h ago', icon: Bell, color: '#8b5cf6' },
  { text: 'Creative Writing lesson updated', time: 'Yesterday', icon: Edit, color: '#ec4899' },
]

const COMPLETION_TREND = [61, 65, 68, 70, 71, 73, 74, 73]
const TREND_LABELS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Now']

const subjectFilters: SubjectFilter[] = ['All', 'Science', 'Math', 'History', 'English', 'Art']

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('All')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [aiOpen, setAiOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>(COURSES)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Science')
  const [newGrade, setNewGrade] = useState('7th')
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [toastMsg, setToastMsg] = useState('')

  const filtered = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = !search.trim() || course.title.toLowerCase().includes(search.toLowerCase()) || course.subject.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = subjectFilter === 'All' || course.subject === subjectFilter
      return matchesSearch && matchesSubject
    })
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'a-z': return a.title.localeCompare(b.title)
        case 'most-lessons': return b.lessons - a.lessons
        case 'completion': return b.completion - a.completion
        default: return 0
      }
    })
    return result
  }, [search, subjectFilter, sortBy, courses])

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
  const avgCompletion = Math.round(courses.filter(c => c.status === 'active').reduce((sum, c) => sum + c.completion, 0) / courses.filter(c => c.status === 'active').length)
  const activeCourses = courses.filter(c => c.status === 'active').length

  const subjectCounts: Record<string, number> = {}
  courses.forEach(c => { subjectCounts[c.subject] = (subjectCounts[c.subject] || 0) + 1 })
  const subjectEntries = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  function createCourse() {
    if (!newTitle.trim()) return
    const colorMap: Record<string, string> = { Science: '#8b5cf6', Math: '#14b8a6', History: '#f97316', English: '#f43f5e', Art: '#ec4899' }
    const newCourse: Course = {
      id: String(Date.now()),
      title: newTitle,
      subject: newSubject,
      grade: newGrade,
      color: colorMap[newSubject] || '#6366f1',
      lessons: 0,
      students: 0,
      completion: 0,
      description: 'New course — add a description to get started.',
      lastUpdated: 'Just now',
      status: 'draft',
    }
    setCourses(prev => [newCourse, ...prev])
    setCreateOpen(false)
    setNewTitle('')
    showToast('Course created successfully')
  }

  function archiveCourse(id: string) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'archived' as const } : c))
    setActionMenu(null)
    showToast('Course archived')
  }

  function duplicateCourse(id: string) {
    const orig = courses.find(c => c.id === id)
    if (!orig) return
    const dup = { ...orig, id: String(Date.now()), title: orig.title + ' (Copy)', status: 'draft' as const, completion: 0, lastUpdated: 'Just now' }
    setCourses(prev => [dup, ...prev])
    setActionMenu(null)
    showToast('Course duplicated')
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setCourses(prev => prev.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Course deleted')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border border-success-500/30"
            style={{ background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(16px)' }}
          >
            <Check className="w-4 h-4 text-success-400" />
            <span className="text-sm font-semibold text-success-300">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div className="relative glass-card p-6 w-full max-w-sm" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-2xl bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-danger-400" />
              </div>
              <h3 className="text-base font-bold text-white text-center mb-1">Delete Course?</h3>
              <p className="text-xs text-surface-400 text-center mb-5">&ldquo;{deleteTarget.title}&rdquo; and all its lessons will be permanently removed.</p>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs py-2" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <motion.button className="flex-1 text-xs py-2 rounded-xl font-semibold bg-danger-500/20 text-danger-300 border border-danger-500/30 hover:bg-danger-500/30 transition-colors" onClick={confirmDelete} whileHover={{ scale: 1.02 }}>Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Course Modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreateOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div className="relative glass-card p-6 w-full max-w-md" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Create New Course</h3>
                <button onClick={() => setCreateOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-surface-300 block mb-1.5">Course Title</label>
                  <input
                    type="text"
                    placeholder="e.g. AP Environmental Science"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-surface-300 block mb-1.5">Subject</label>
                    <select value={newSubject} onChange={e => setNewSubject(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-1 focus:ring-accent-500">
                      {['Science', 'Math', 'History', 'English', 'Art'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-surface-300 block mb-1.5">Grade Level</label>
                    <select value={newGrade} onChange={e => setNewGrade(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-1 focus:ring-accent-500">
                      {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 btn-secondary text-xs py-2.5" onClick={() => setCreateOpen(false)}>Cancel</button>
                  <motion.button
                    className="flex-1 btn-gradient text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createCourse}
                    disabled={!newTitle.trim()}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Create Course
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero mesh header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white">My Courses</h2>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/20">{activeCourses} Active</span>
                </div>
                <p className="text-sm text-surface-400">{courses.length} courses total · {courses.filter(c => c.status === 'draft').length} drafts · {courses.reduce((s, c) => s + c.lessons, 0)} lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-gradient" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setCreateOpen(true)}>
                <Sparkles className="w-4 h-4" />
                AI Create Course
              </motion.button>
              <motion.button className="btn-secondary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                New Course
              </motion.button>
            </div>
          </div>
          {/* Quick stat pills */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06] flex-wrap">
            {[
              { label: 'Total Students', value: totalStudents, color: '#14b8a6' },
              { label: 'Avg Completion', value: `${avgCompletion}%`, color: '#8b5cf6' },
              { label: 'Lessons Ready', value: courses.reduce((s, c) => s + c.lessons, 0), color: '#f97316' },
              { label: 'Upcoming Milestones', value: courses.filter(c => c.nextMilestone).length, color: '#f59e0b' },
            ].map(pill => (
              <div key={pill.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pill.color }} />
                <span className="text-xs text-surface-400">{pill.label}</span>
                <span className="text-xs font-black" style={{ color: pill.color }}>{pill.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen, color: '#8b5cf6', sub: `${activeCourses} active` },
            { label: 'Active Students', value: totalStudents.toString(), icon: Users, color: '#14b8a6', sub: 'Across all courses' },
            { label: 'Lessons Created', value: courses.reduce((s, c) => s + c.lessons, 0).toString(), icon: FileText, color: '#f97316', sub: 'Ready to teach' },
            { label: 'Avg Completion', value: `${avgCompletion}%`, icon: BarChart2, color: '#ec4899', sub: 'Active courses only' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-surface-600 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insights */}
      <FadeUp delay={0.08}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Course Insights</span>
              <span className="bg-accent-500/20 text-accent-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 alerts</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-500/[0.08] border border-warning-500/20">
                    <AlertCircle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">Low Progress Alert</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Creative Writing is at 30% completion with a workshop session approaching Oct 16. Consider adding 2 more lessons this week to stay on track.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success-500/[0.08] border border-success-500/20">
                    <TrendingUp className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-success-300">Top Performing Class</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Earth Science 6 is at 90% completion — your highest achieving class this semester. Consider sharing the lesson sequence as a template for next year.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-500/[0.08] border border-accent-500/20">
                    <Zap className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-accent-300">Draft Needs Attention</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">World Geography has been in Draft for 2 weeks. 20 students are enrolled. AI can generate your first 5 lessons from the course description in under 2 minutes.</p>
                      <button className="text-[10px] text-accent-400 font-semibold mt-1 hover:underline" onClick={() => showToast('Generating 5 lessons for World Geography...')}>Generate lessons →</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Search & Filter */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value as SubjectFilter)}
              className="pl-9 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-surface-300 focus:outline-none focus:border-accent-500/40 appearance-none min-w-[140px]">
              {subjectFilters.map(s => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
              className="pr-8 py-2.5 px-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-surface-300 focus:outline-none appearance-none min-w-[140px]">
              <option value="recent">Recent</option>
              <option value="a-z">A-Z</option>
              <option value="most-lessons">Most Lessons</option>
              <option value="completion">Completion %</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
          </div>
          <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.03]">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-accent-500/15 text-accent-400' : 'text-surface-500 hover:text-surface-300 hover:bg-white/[0.04]'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-accent-500/15 text-accent-400' : 'text-surface-500 hover:text-surface-300 hover:bg-white/[0.04]'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Main layout: courses + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" className="glass-card p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
                  <Search className="w-7 h-7 text-surface-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No courses found</h3>
                <p className="text-sm text-surface-400 mb-4">No courses match your current filters.</p>
                <button onClick={() => { setSearch(''); setSubjectFilter('All') }} className="text-xs text-accent-400 hover:text-accent-300 font-semibold">Clear filters</button>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {filtered.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.18 } }}
                    className="relative"
                  >
                    <Link href={`/courses/${course.id}`} className="glass-card overflow-hidden group block">
                      <div className="h-1.5" style={{ backgroundColor: course.color }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: course.color + '20' }}>
                              <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors truncate">{course.title}</h3>
                              <p className="text-xs text-surface-500">{course.subject} · Grade {course.grade}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className={`badge ${course.status === 'active' ? 'bg-success-400/15 text-success-400' : course.status === 'draft' ? 'bg-white/[0.06] text-surface-400' : 'bg-danger-500/10 text-danger-400'}`}>
                              {course.status === 'active' ? 'Active' : course.status === 'draft' ? 'Draft' : 'Archived'}
                            </span>
                            <div className="relative">
                              <button
                                className="text-surface-500 hover:text-surface-300 transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                                onClick={e => { e.preventDefault(); setActionMenu(actionMenu === course.id ? null : course.id) }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <AnimatePresence>
                                {actionMenu === course.id && (
                                  <>
                                  <div className="fixed inset-0 z-40" onClick={e => { e.preventDefault(); setActionMenu(null) }} />
                                  <motion.div
                                    className="absolute right-0 top-full mt-1 w-44 glass-card border border-white/[0.1] shadow-xl z-50"
                                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {[
                                      { icon: Edit, label: 'Edit', action: () => setActionMenu(null) },
                                      { icon: Copy, label: 'Duplicate', action: () => duplicateCourse(course.id) },
                                      { icon: Download, label: 'Export', action: () => setActionMenu(null) },
                                      { icon: Archive, label: 'Archive', action: () => archiveCourse(course.id) },
                                      { icon: Trash2, label: 'Delete', action: () => { setDeleteTarget(course); setActionMenu(null) }, danger: true },
                                    ].map(item => (
                                      <button
                                        key={item.label}
                                        onClick={item.action}
                                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-white/[0.04] transition-colors ${item.danger ? 'text-danger-400' : 'text-surface-300'}`}
                                      >
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.label}
                                      </button>
                                    ))}
                                  </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-surface-400 mb-4 line-clamp-2">{course.description}</p>
                        {course.nextMilestone && (
                          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg bg-accent-500/8 border border-accent-500/15">
                            <Calendar className="w-3 h-3 text-accent-400 flex-shrink-0" />
                            <span className="text-[10px] text-accent-300 font-medium">{course.nextMilestone}</span>
                          </div>
                        )}
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
                              transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-surface-500 pt-3 border-t border-white/[0.06]">
                          <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.lessons} lessons</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students} students</span>
                          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{course.lastUpdated}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                        <div className="w-1 self-stretch flex-shrink-0" style={{ backgroundColor: course.color }} />
                        <div className="flex-1 flex items-center gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: course.color + '20' }}>
                            <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white group-hover:text-accent-400 transition-colors truncate text-sm">{course.title}</h3>
                            <p className="text-xs text-surface-500">{course.subject} · Grade {course.grade}</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 w-32 flex-shrink-0">
                            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full" style={{ backgroundColor: course.color }} initial={{ width: 0 }} animate={{ width: `${course.completion}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }} />
                            </div>
                            <span className="text-xs font-bold w-8 text-right" style={{ color: course.color }}>{course.completion}%</span>
                          </div>
                          <div className="hidden md:flex items-center gap-4 text-xs text-surface-500 flex-shrink-0">
                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.lessons}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.lastUpdated}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`badge ${course.status === 'active' ? 'bg-success-400/15 text-success-400' : 'bg-white/[0.06] text-surface-400'}`}>
                              {course.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                            <button className="text-surface-500 hover:text-surface-300 transition-colors" onClick={e => e.preventDefault()}>
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

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Completion Trend */}
          <FadeInWhenVisible>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-accent-400" />
                <h3 className="text-xs font-bold text-white">Avg Completion Trend</h3>
              </div>
              {(() => {
                const W = 240, H = 80, PX = 10, PY = 8
                const minV = 55, maxV = 80
                const sx = (i: number) => PX + (i / (COMPLETION_TREND.length - 1)) * (W - PX * 2)
                const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                const pts = COMPLETION_TREND.map((v, i) => ({ x: sx(i), y: sy(v) }))
                let lp = `M ${pts[0].x} ${pts[0].y}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = (pts[i].x + pts[i - 1].x) / 2
                  lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                }
                const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                    <defs>
                      <linearGradient id="cr-comp-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[60, 70, 80].map(g => (
                      <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}
                    <path d={ap} fill="url(#cr-comp-grad)" />
                    <motion.path d={lp} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.85, ease: 'easeOut' }} />
                    {pts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={i === pts.length - 1 ? 3.5 : 2} fill="#8b5cf6" />
                        <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7.5">{TREND_LABELS[i]}</text>
                      </g>
                    ))}
                    <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 7} textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="700">{COMPLETION_TREND[COMPLETION_TREND.length - 1]}%</text>
                  </svg>
                )
              })()}
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success-400" />
                <span className="text-[11px] text-success-300 font-semibold">+12% this semester</span>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Subject Breakdown */}
          <FadeInWhenVisible delay={0.06}>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-white mb-3">Courses by Subject</h3>
              <div className="space-y-2">
                {subjectEntries.map(([subject, count], i) => {
                  const colors = ['#8b5cf6', '#14b8a6', '#f97316', '#f43f5e', '#ec4899']
                  const pct = Math.round((count / courses.length) * 100)
                  return (
                    <div key={subject} className="flex items-center gap-2">
                      <span className="text-[10px] text-surface-400 w-14 text-right flex-shrink-0">{subject}</span>
                      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: colors[i % colors.length] }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: 'easeOut' }} />
                      </div>
                      <span className="text-[10px] text-surface-500 w-4 flex-shrink-0">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Recent Activity */}
          <FadeInWhenVisible delay={0.1}>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-white mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <motion.div key={i} className="flex items-start gap-2.5" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: item.color + '20' }}>
                      <item.icon className="w-3 h-3" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-[11px] text-surface-300">{item.text}</p>
                      <p className="text-[9px] text-surface-600 mt-0.5">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Upcoming Milestones */}
          <FadeInWhenVisible delay={0.14}>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-warning-400" />
                Upcoming Milestones
              </h3>
              <div className="space-y-2">
                {courses.filter(c => c.nextMilestone).map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.03]">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: c.color }} />
                    <div>
                      <p className="text-[10px] font-semibold text-surface-300">{c.nextMilestone}</p>
                      <p className="text-[9px] text-surface-500">{c.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Bottom analytics row */}
      <FadeInWhenVisible delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completion breakdown bars */}
          <div className="glass-card p-5 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent-400" /> Course Completion Overview
              </h4>
              <span className="text-[10px] text-success-400 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {avgCompletion}% avg</span>
            </div>
            <div className="space-y-3">
              {[...courses].filter(c => c.status === 'active').sort((a, b) => b.completion - a.completion).map((c, i) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-400 truncate flex-1 mr-2">{c.title}</span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: c.color }}>{c.completion}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.completion}%` }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass-card p-5">
            <h4 className="text-sm font-bold text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { icon: Sparkles,  label: 'AI Lesson Generator',    color: '#6366f1', action: () => showToast('AI Lesson Generator opened') },
                { icon: Copy,      label: 'Duplicate Best Course',   color: '#10b981', action: () => showToast('Top course duplicated as draft') },
                { icon: Download,  label: 'Export All Courses',      color: '#f97316', action: () => showToast('Courses exported to PDF') },
                { icon: Users,     label: 'Bulk Enroll Students',    color: '#8b5cf6', action: () => showToast('Bulk enrollment panel opened') },
                { icon: Star,      label: 'Mark as Template',        color: '#f59e0b', action: () => showToast('Course saved as template') },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '18' }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs text-surface-300 group-hover:text-white transition-colors">{item.label}</span>
                  <ChevronDown className="w-3 h-3 text-surface-600 ml-auto -rotate-90 group-hover:text-surface-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
