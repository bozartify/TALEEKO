'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, BookOpen, Clock, Star, Play, Check, Lock,
  TrendingUp, Target, Users, ChevronRight, Sparkles,
  ChevronDown, GraduationCap, Layers, Brain, BarChart3,
  Monitor, Lightbulb, Flame, Zap, ArrowUpRight, Shield,
  BookMarked, Cpu, PenTool, ListChecks, CircleDot
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
type CourseStatus = 'in-progress' | 'completed' | 'not-started'
type Category = 'All' | 'AI in Education' | 'Assessment' | 'Classroom Management' | 'Differentiation' | 'Technology'

interface SyllabusModule {
  title: string
  duration: string
}

interface Course {
  id: string
  title: string
  category: Category
  description: string
  duration: string
  hours: number
  modules: number
  enrolled: number
  rating: number
  progress: number
  color: string
  status: CourseStatus
  instructor: string
  difficulty: Difficulty
  syllabus: SyllabusModule[]
}

const courses: Course[] = [
  {
    id: '1',
    title: 'AI in the Classroom: A Teacher\'s Guide',
    category: 'AI in Education',
    description: 'Master the fundamentals of integrating artificial intelligence tools into your teaching practice. Learn prompt engineering, AI-assisted lesson planning, and ethical considerations for using AI with students.',
    duration: '8 hours',
    hours: 8,
    modules: 8,
    enrolled: 2400,
    rating: 4.9,
    progress: 75,
    color: '#6366f1',
    status: 'in-progress',
    instructor: 'Dr. Maria Santos',
    difficulty: 'Intermediate',
    syllabus: [
      { title: 'Introduction to AI in Education', duration: '45 min' },
      { title: 'Prompt Engineering for Teachers', duration: '60 min' },
      { title: 'AI-Powered Lesson Planning', duration: '75 min' },
      { title: 'Student-Facing AI Tools', duration: '60 min' },
      { title: 'Ethics & Digital Citizenship', duration: '50 min' },
      { title: 'Practical Classroom Integration', duration: '90 min' },
    ],
  },
  {
    id: '2',
    title: 'Differentiated Instruction Mastery',
    category: 'Differentiation',
    description: 'Build expertise in designing lessons that meet every learner where they are. Covers tiered assignments, flexible grouping, learning profiles, and formative assessment strategies for differentiation.',
    duration: '6 hours',
    hours: 6,
    modules: 12,
    enrolled: 1800,
    rating: 4.8,
    progress: 100,
    color: '#10b981',
    status: 'completed',
    instructor: 'Prof. James Walker',
    difficulty: 'Advanced',
    syllabus: [
      { title: 'Foundations of Differentiation', duration: '30 min' },
      { title: 'Learning Profiles & Readiness', duration: '40 min' },
      { title: 'Tiered Assignment Design', duration: '50 min' },
      { title: 'Flexible Grouping Strategies', duration: '45 min' },
      { title: 'Formative Assessment for DI', duration: '35 min' },
    ],
  },
  {
    id: '3',
    title: 'Data-Driven Decision Making',
    category: 'Assessment',
    description: 'Transform raw student data into actionable instructional insights. Learn to analyze assessment results, identify trends, set measurable goals, and communicate findings to stakeholders.',
    duration: '5 hours',
    hours: 5,
    modules: 6,
    enrolled: 950,
    rating: 4.7,
    progress: 30,
    color: '#f97316',
    status: 'in-progress',
    instructor: 'Dr. Lisa Chang',
    difficulty: 'Intermediate',
    syllabus: [
      { title: 'Types of Educational Data', duration: '40 min' },
      { title: 'Assessment Analysis Frameworks', duration: '55 min' },
      { title: 'Identifying Student Trends', duration: '50 min' },
      { title: 'Goal Setting with Data', duration: '45 min' },
      { title: 'Data Visualization & Reporting', duration: '60 min' },
    ],
  },
  {
    id: '4',
    title: 'Social-Emotional Learning Integration',
    category: 'Classroom Management',
    description: 'Seamlessly weave SEL competencies into your academic curriculum. Explore evidence-based strategies for building classroom community, emotional regulation, and student well-being.',
    duration: '5 hours',
    hours: 5,
    modules: 10,
    enrolled: 3200,
    rating: 4.9,
    progress: 0,
    color: '#ec4899',
    status: 'not-started',
    instructor: 'Dr. Amir Hassan',
    difficulty: 'Beginner',
    syllabus: [
      { title: 'CASEL Framework Overview', duration: '35 min' },
      { title: 'Building Classroom Community', duration: '50 min' },
      { title: 'Self-Awareness Activities', duration: '40 min' },
      { title: 'Relationship Skills in Action', duration: '45 min' },
      { title: 'Responsible Decision-Making', duration: '40 min' },
      { title: 'SEL Across the Curriculum', duration: '50 min' },
    ],
  },
  {
    id: '5',
    title: 'Project-Based Learning Design',
    category: 'Differentiation',
    description: 'Design authentic, standards-aligned projects that engage students in real-world problem solving. From driving questions to public presentations, build a complete PBL toolkit.',
    duration: '4 hours',
    hours: 4,
    modules: 8,
    enrolled: 1500,
    rating: 4.6,
    progress: 0,
    color: '#22d3ee',
    status: 'not-started',
    instructor: 'Sarah Kim, M.Ed.',
    difficulty: 'Intermediate',
    syllabus: [
      { title: 'PBL Fundamentals & Research', duration: '30 min' },
      { title: 'Crafting Driving Questions', duration: '35 min' },
      { title: 'Scaffolding Student Inquiry', duration: '40 min' },
      { title: 'Assessment in PBL', duration: '45 min' },
    ],
  },
  {
    id: '6',
    title: 'Inclusive Classroom Strategies',
    category: 'Classroom Management',
    description: 'Create a learning environment where every student belongs. Covers UDL principles, accommodation best practices, co-teaching models, and culturally responsive pedagogy.',
    duration: '5 hours',
    hours: 5,
    modules: 10,
    enrolled: 2100,
    rating: 4.8,
    progress: 0,
    color: '#8b5cf6',
    status: 'not-started',
    instructor: 'Dr. Rachel Moore',
    difficulty: 'Beginner',
    syllabus: [
      { title: 'Understanding Inclusion', duration: '35 min' },
      { title: 'Universal Design for Learning', duration: '50 min' },
      { title: 'Effective Accommodations', duration: '45 min' },
      { title: 'Co-Teaching Models', duration: '40 min' },
      { title: 'Culturally Responsive Practices', duration: '50 min' },
    ],
  },
  {
    id: '7',
    title: 'Generative AI for Assessment Design',
    category: 'AI in Education',
    description: 'Leverage generative AI to create rigorous, standards-aligned assessments at scale. Build item banks, rubrics, and adaptive quizzes using the latest AI tools and pedagogical best practices.',
    duration: '6 hours',
    hours: 6,
    modules: 8,
    enrolled: 1120,
    rating: 4.8,
    progress: 15,
    color: '#a855f7',
    status: 'in-progress',
    instructor: 'Dr. Kenji Tanaka',
    difficulty: 'Advanced',
    syllabus: [
      { title: 'AI Assessment Landscape', duration: '40 min' },
      { title: 'Prompt Engineering for Assessments', duration: '55 min' },
      { title: 'Building AI-Powered Item Banks', duration: '60 min' },
      { title: 'Rubric Generation & Validation', duration: '50 min' },
      { title: 'Adaptive Testing with AI', duration: '45 min' },
      { title: 'Quality Assurance & Bias Review', duration: '50 min' },
    ],
  },
  {
    id: '8',
    title: 'EdTech Integration Essentials',
    category: 'Technology',
    description: 'Navigate the modern edtech landscape with confidence. Evaluate, implement, and measure the impact of technology tools in your classroom through the SAMR and TPACK frameworks.',
    duration: '4 hours',
    hours: 4,
    modules: 7,
    enrolled: 1750,
    rating: 4.5,
    progress: 0,
    color: '#06b6d4',
    status: 'not-started',
    instructor: 'Marcus Lee, M.Ed.',
    difficulty: 'Beginner',
    syllabus: [
      { title: 'SAMR & TPACK Frameworks', duration: '35 min' },
      { title: 'Evaluating EdTech Tools', duration: '40 min' },
      { title: 'LMS Best Practices', duration: '45 min' },
      { title: 'Digital Workflow Optimization', duration: '35 min' },
      { title: 'Measuring EdTech Impact', duration: '45 min' },
    ],
  },
  {
    id: '9',
    title: 'Mastering Formative Assessment',
    category: 'Assessment',
    description: 'Move beyond exit tickets. Build a formative assessment system that drives daily instructional decisions, catches misconceptions early, and empowers student self-assessment.',
    duration: '3 hours',
    hours: 3,
    modules: 6,
    enrolled: 2050,
    rating: 4.7,
    progress: 0,
    color: '#eab308',
    status: 'not-started',
    instructor: 'Dr. Priya Sharma',
    difficulty: 'Beginner',
    syllabus: [
      { title: 'Formative vs. Summative', duration: '25 min' },
      { title: 'Check-for-Understanding Techniques', duration: '35 min' },
      { title: 'Student Self-Assessment', duration: '30 min' },
      { title: 'Using Data in Real Time', duration: '40 min' },
    ],
  },
  {
    id: '10',
    title: 'Advanced Classroom Management',
    category: 'Classroom Management',
    description: 'Go beyond the basics with trauma-informed practices, restorative discipline, and proactive behavior systems. Designed for experienced educators seeking to refine their craft.',
    duration: '5 hours',
    hours: 5,
    modules: 9,
    enrolled: 1320,
    rating: 4.6,
    progress: 0,
    color: '#f43f5e',
    status: 'not-started',
    instructor: 'Dr. Angela Brooks',
    difficulty: 'Advanced',
    syllabus: [
      { title: 'Trauma-Informed Classroom', duration: '50 min' },
      { title: 'Restorative Practices', duration: '45 min' },
      { title: 'Proactive Behavior Systems', duration: '40 min' },
      { title: 'De-Escalation Strategies', duration: '35 min' },
      { title: 'Building Student Agency', duration: '50 min' },
    ],
  },
]

const categories: Category[] = ['All', 'AI in Education', 'Assessment', 'Classroom Management', 'Differentiation', 'Technology']

const achievements = [
  { title: 'First Course', desc: 'Complete your first PD course', icon: BookMarked, color: '#10b981', earned: true },
  { title: 'AI Pioneer', desc: 'Complete an AI in Education course', icon: Cpu, color: '#6366f1', earned: true },
  { title: 'Assessment Expert', desc: 'Complete 2 Assessment courses', icon: ListChecks, color: '#f97316', earned: false, progressText: '1/2' },
  { title: '50 PD Hours', desc: 'Log 50 hours of professional development', icon: Clock, color: '#ec4899', earned: false, progressText: '45/50' },
]

const learningPath = [
  { step: 1, title: 'Foundations', desc: 'Core teaching frameworks & classroom essentials', status: 'completed' as const, color: '#10b981' },
  { step: 2, title: 'AI Integration', desc: 'Leverage AI tools for planning & assessment', status: 'current' as const, color: '#6366f1' },
  { step: 3, title: 'Advanced Practice', desc: 'Data-driven instruction & differentiation mastery', status: 'locked' as const, color: '#8b5cf6' },
  { step: 4, title: 'Leadership', desc: 'Mentor peers & lead professional learning communities', status: 'locked' as const, color: '#f59e0b' },
]

const recommended = [
  {
    title: 'Generative AI for Assessment Design',
    reason: 'Based on your progress in AI in the Classroom',
    match: 94,
    color: '#a855f7',
    instructor: 'Dr. Kenji Tanaka',
    hours: 6,
    difficulty: 'Advanced' as Difficulty,
  },
  {
    title: 'Mastering Formative Assessment',
    reason: 'Complements your Data-Driven course',
    match: 88,
    color: '#eab308',
    instructor: 'Dr. Priya Sharma',
    hours: 3,
    difficulty: 'Beginner' as Difficulty,
  },
  {
    title: 'EdTech Integration Essentials',
    reason: 'Popular with teachers in your district',
    match: 82,
    color: '#06b6d4',
    instructor: 'Marcus Lee, M.Ed.',
    hours: 4,
    difficulty: 'Beginner' as Difficulty,
  },
]

const difficultyConfig: Record<Difficulty, { bg: string; text: string }> = {
  Beginner:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  Intermediate: { bg: 'bg-amber-500/15',   text: 'text-amber-400' },
  Advanced:     { bg: 'bg-rose-500/15',     text: 'text-rose-400' },
}

// Weekly learning goal
const weeklyGoal = { current: 3, target: 5, unit: 'hours' }

export default function ProfessionalDevPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category>('All')
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  const filtered = categoryFilter === 'All'
    ? courses
    : courses.filter(c => c.category === categoryFilter)

  const totalHoursEarned = 45
  const inProgressCount = courses.filter(c => c.status === 'in-progress').length
  const completedCount = courses.filter(c => c.status === 'completed').length
  const certificateCount = 2

  const stats = [
    { label: 'Courses Available', value: `${courses.length}`, icon: BookOpen, color: '#6366f1', trend: '+2 new' },
    { label: 'In Progress', value: `${inProgressCount}`, icon: Play, color: '#f97316', trend: 'Active' },
    { label: 'PD Hours Earned', value: `${totalHoursEarned}`, icon: Clock, color: '#10b981', trend: '+6 this month' },
    { label: 'Certificates', value: `${certificateCount}`, icon: Award, color: '#f59e0b', trend: '1 pending' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeUp>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/[0.04] rounded-full blur-[60px]" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black text-white">Professional Development</h2>
                <p className="text-sm text-surface-400 mt-0.5">
                  Grow your teaching practice with expert-led courses and AI-powered learning paths.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                    <Flame className="w-3 h-3" /> 12-day streak
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-surface-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Level 3 Learner
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              className="btn-gradient flex-shrink-0"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="w-4 h-4" /> AI Recommendations
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {stats.map((s) => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="glass-card p-5 h-full"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s.color + '18' }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                  {s.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Weekly Learning Goal */}
      <FadeUp delay={0.12}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/15">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Weekly Learning Goal</h3>
                <p className="text-[11px] text-surface-500">Resets every Monday</p>
              </div>
            </div>
            <span className="text-lg font-black text-white">
              {weeklyGoal.current}<span className="text-surface-500 font-semibold text-sm">/{weeklyGoal.target} {weeklyGoal.unit}</span>
            </span>
          </div>
          <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="text-xs text-surface-500 mt-2">
            {weeklyGoal.target - weeklyGoal.current} more {weeklyGoal.unit} to hit your weekly target. Keep going!
          </p>
        </div>
      </FadeUp>

      {/* Learning Path */}
      <FadeInWhenVisible delay={0.05}>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/15">
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-base font-bold text-white">Your Learning Path</h3>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/[0.06] hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {learningPath.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  {/* Node */}
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 mb-3 ${
                      step.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : step.status === 'current'
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-white/[0.12] bg-white/[0.04]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {step.status === 'completed' ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : step.status === 'current' ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <CircleDot className="w-5 h-5 text-indigo-400" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 text-surface-600" />
                    )}
                  </motion.div>
                  <span className="text-xs font-bold text-surface-400 mb-1">Step {step.step}</span>
                  <h4 className={`text-sm font-bold mb-1 ${
                    step.status === 'locked' ? 'text-surface-500' : 'text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-surface-500 leading-relaxed">{step.desc}</p>
                  {step.status === 'current' && (
                    <span className="mt-2 text-[10px] font-bold text-indigo-400 bg-indigo-500/15 px-2.5 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                  {step.status === 'completed' && (
                    <span className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Achievements & Certificates */}
      <FadeInWhenVisible delay={0.05}>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/15">
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white">Achievements & Certificates</h3>
            </div>
            <span className="text-xs text-surface-500">
              {achievements.filter(a => a.earned).length}/{achievements.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                className={`relative rounded-xl border p-4 text-center transition-all ${
                  a.earned
                    ? 'bg-white/[0.04] border-white/[0.08]'
                    : 'bg-white/[0.02] border-white/[0.04]'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2, transition: { duration: 0.18 } }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                    a.earned ? '' : 'opacity-40'
                  }`}
                  style={{ backgroundColor: a.color + '20' }}
                  whileHover={a.earned ? { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } } : {}}
                >
                  <a.icon className="w-6 h-6" style={{ color: a.earned ? a.color : undefined }} />
                </motion.div>
                <h4 className={`text-xs font-bold mb-0.5 ${a.earned ? 'text-white' : 'text-surface-500'}`}>
                  {a.title}
                </h4>
                <p className="text-[10px] text-surface-500 mb-2">{a.desc}</p>
                {a.earned ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Earned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-surface-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                    {a.progressText ? (
                      <>{a.progressText}</>
                    ) : (
                      <><Lock className="w-2.5 h-2.5" /> Locked</>
                    )}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Recommended for You */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/15">
              <Brain className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-base font-bold text-white">Recommended for You</h3>
            <span className="text-[10px] font-medium text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full ml-1">
              AI-Powered
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map((rec, i) => (
              <motion.div
                key={rec.title}
                className="glass-card p-5 group cursor-pointer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: rec.color + '18', color: rec.color }}
                  >
                    {rec.match}% Match
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyConfig[rec.difficulty].bg} ${difficultyConfig[rec.difficulty].text}`}>
                    {rec.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-surface-500 mb-3">by {rec.instructor}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-violet-400 bg-violet-500/10 px-2.5 py-1.5 rounded-lg mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>{rec.reason}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <Clock className="w-3 h-3" /> {rec.hours}h
                  </span>
                  <button className="btn-secondary text-[11px] py-1 px-3">
                    Enroll <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Category Filter Tabs */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">All Courses</h3>
            <span className="text-xs text-surface-500">{filtered.length} courses</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              className="glass-card overflow-hidden group"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
            >
              {/* Color top bar */}
              <div className="h-1.5" style={{ backgroundColor: course.color }} />
              <div className="p-5">
                {/* Top row: category + rating */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: course.color + '18', color: course.color }}
                    >
                      {course.category}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyConfig[course.difficulty].bg} ${difficultyConfig[course.difficulty].text}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-surface-300 font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* Title + instructor */}
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">
                  {course.title}
                </h4>
                <p className="text-xs text-surface-500 mb-3">by {course.instructor}</p>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-surface-400 mb-3 flex-wrap">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules} modules</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled.toLocaleString()}</span>
                </div>

                {/* Star rating display */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.floor(course.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : star - 0.5 <= course.rating
                          ? 'text-amber-400 fill-amber-400/50'
                          : 'text-surface-600'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-surface-500 ml-1">({course.enrolled.toLocaleString()})</span>
                </div>

                {/* Progress bar for in-progress courses */}
                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-surface-400">Progress</span>
                      <span className="text-[10px] font-bold" style={{ color: course.color }}>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: course.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      />
                    </div>
                  </div>
                )}

                {/* Expand / collapse toggle */}
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="flex items-center gap-1 text-[11px] text-accent-400 font-semibold mb-3 hover:text-accent-300 transition-colors"
                >
                  {expandedCourse === course.id ? 'Hide Details' : 'View Details'}
                  <motion.div
                    animate={{ rotate: expandedCourse === course.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </button>

                {/* Expandable details */}
                <AnimatePresence>
                  {expandedCourse === course.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.06] pt-3 mb-3">
                        <p className="text-xs text-surface-400 leading-relaxed mb-3">
                          {course.description}
                        </p>
                        <h5 className="text-[11px] font-bold text-surface-300 mb-2 uppercase tracking-wider">
                          Syllabus
                        </h5>
                        <div className="space-y-1.5">
                          {course.syllabus.map((mod, mi) => (
                            <motion.div
                              key={mi}
                              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: mi * 0.04 }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold bg-white/[0.06] text-surface-400">
                                  {mi + 1}
                                </span>
                                <span className="text-xs text-surface-300">{mod.title}</span>
                              </div>
                              <span className="text-[10px] text-surface-500">{mod.duration}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action button */}
                <motion.button
                  className={`w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    course.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : course.status === 'in-progress'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {course.status === 'completed' ? (
                    <><Check className="w-3.5 h-3.5" /> Completed</>
                  ) : course.status === 'in-progress' ? (
                    <><Play className="w-3.5 h-3.5" /> Continue Learning</>
                  ) : (
                    <><Play className="w-3.5 h-3.5" /> Start Course</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
