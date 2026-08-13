'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layout,
  CheckCircle,
  Sparkles,
  Clock,
  Users,
  Star,
  Eye,
  Copy,
  ChevronRight,
  Search,
  BookOpen,
  Zap,
  Target,
  Layers,
  FileText,
  Check,
  ArrowRight,
  ChevronDown,
  Download,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Package,
  Palette,
  PenTool,
  Play,
  RotateCcw,
  Share2,
  Timer,
  TrendingUp,
  Wand2,
  X,
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ---------- category system ---------- */

const categories = [
  'All',
  '5E Model',
  'Direct Instruction',
  'Project-Based',
  'Flipped',
  'Inquiry-Based',
  'Socratic',
] as const

type Category = (typeof categories)[number]

const categoryColors: Record<string, { bg: string; text: string; gradient: string; bar: string }> = {
  '5E Model':            { bg: 'bg-accent-500/20',   text: 'text-accent-400',   gradient: 'from-accent-500/40 to-accent-600/10',   bar: 'bg-accent-500' },
  'Direct Instruction':  { bg: 'bg-electric-500/20', text: 'text-electric-400', gradient: 'from-electric-500/40 to-electric-600/10', bar: 'bg-electric-500' },
  'Project-Based':       { bg: 'bg-neon-500/20',     text: 'text-neon-400',     gradient: 'from-neon-500/40 to-neon-600/10',         bar: 'bg-neon-500' },
  'Flipped':             { bg: 'bg-success/20',      text: 'text-success',      gradient: 'from-emerald-500/40 to-emerald-600/10',  bar: 'bg-success' },
  'Inquiry-Based':       { bg: 'bg-warning/20',      text: 'text-warning',      gradient: 'from-amber-500/40 to-amber-600/10',      bar: 'bg-warning' },
  'Socratic':            { bg: 'bg-danger/20',        text: 'text-danger',       gradient: 'from-rose-500/40 to-rose-600/10',        bar: 'bg-danger' },
}

/* ---------- data types ---------- */

interface Template {
  id: number
  name: string
  category: string
  description: string
  time: string
  grades: string
  subject: string
  sections: string[]
  stars: number
  uses: number
  featured?: boolean
  targetAudience: string
  materials: string[]
  objectives: string[]
}

interface CommunityTemplate {
  id: number
  name: string
  category: string
  author: string
  school: string
  downloads: number
  stars: number
  description: string
}

interface RecentTemplate {
  id: number
  name: string
  category: string
  usedAt: string
}

/* ---------- template data ---------- */

const templates: Template[] = [
  {
    id: 1,
    name: '5E Science Investigation',
    category: '5E Model',
    description:
      'A structured inquiry framework that guides students through scientific discovery using the 5E instructional model. Students engage with phenomena, explore through hands-on activities, construct explanations, elaborate on concepts, and demonstrate understanding through varied assessments.',
    time: '90 min',
    grades: '6-12',
    subject: 'Science',
    sections: ['Engage: Hook & Prior Knowledge', 'Explore: Hands-on Investigation', 'Explain: Concept Building', 'Elaborate: Application & Extension', 'Evaluate: Assessment & Reflection'],
    stars: 4.9,
    uses: 2847,
    featured: true,
    targetAudience: 'Middle and high school science teachers looking for structured inquiry lessons',
    materials: ['Lab equipment (varies by topic)', 'Student investigation journals', 'Digital simulation access', 'Assessment rubric handouts'],
    objectives: ['Apply the scientific method through guided inquiry', 'Construct evidence-based explanations', 'Connect new concepts to prior knowledge', 'Demonstrate understanding through multiple assessment modes'],
  },
  {
    id: 2,
    name: 'Socratic Seminar Discussion',
    category: 'Socratic',
    description:
      'Facilitate deep, student-led discussions with structured questioning techniques and collaborative dialogue. This template provides a framework for open-ended questioning that promotes critical thinking and respectful academic discourse.',
    time: '60 min',
    grades: '8-12',
    subject: 'Humanities',
    sections: ['Opening Question & Norms Review', 'Inner Circle Discussion Round', 'Outer Circle Observation & Notes', 'Role Rotation & Second Round', 'Closing Reflection & Written Response', 'Peer Feedback Exchange'],
    stars: 4.8,
    uses: 1923,
    targetAudience: 'Humanities teachers seeking to develop student-led discussion skills',
    materials: ['Selected text passage', 'Discussion norms poster', 'Observation recording sheets', 'Self-assessment forms'],
    objectives: ['Engage in evidence-based academic discourse', 'Practice active listening and respectful disagreement', 'Analyze complex texts through collaborative inquiry', 'Develop metacognitive reflection skills'],
  },
  {
    id: 3,
    name: 'Project-Based Learning Unit',
    category: 'Project-Based',
    description:
      'Multi-week project framework with milestones, checkpoints, and authentic assessment criteria. Students tackle real-world problems through research, prototyping, and presentation.',
    time: '2-3 weeks',
    grades: '4-12',
    subject: 'Cross-curricular',
    sections: ['Driving Question Launch', 'Research & Knowledge Building', 'Prototype Development', 'Peer Critique & Iteration', 'Final Product Refinement', 'Public Presentation & Reflection'],
    stars: 4.7,
    uses: 2156,
    targetAudience: 'Teachers of any subject wanting authentic, student-driven learning experiences',
    materials: ['Project planning templates', 'Research resource guides', 'Peer critique protocols', 'Presentation equipment'],
    objectives: ['Investigate authentic, complex problems', 'Collaborate effectively in teams', 'Iterate based on feedback', 'Present findings to an authentic audience'],
  },
  {
    id: 4,
    name: 'Flipped Classroom Module',
    category: 'Flipped',
    description:
      'Pre-class video content paired with in-class active learning activities and collaborative problem-solving. Maximizes face-to-face time for deeper application and support.',
    time: '45 min',
    grades: '7-12',
    subject: 'Mathematics',
    sections: ['Pre-class Video Assignment', 'Warm-up Comprehension Check', 'Guided Practice Problems', 'Collaborative Problem Solving', 'Independent Application', 'Exit Ticket Assessment'],
    stars: 4.6,
    uses: 1547,
    targetAudience: 'Math teachers transitioning to blended learning models',
    materials: ['Pre-recorded video lessons', 'Digital quiz platform access', 'Practice problem sets', 'Exit ticket templates'],
    objectives: ['Self-pace through foundational content', 'Apply concepts through guided and independent practice', 'Collaborate to solve complex problems', 'Self-assess understanding through exit tickets'],
  },
  {
    id: 5,
    name: 'Direct Instruction Mastery',
    category: 'Direct Instruction',
    description:
      'Explicit teaching with modeling, guided practice, and independent application for skill mastery. A proven framework for systematic instruction.',
    time: '50 min',
    grades: '3-8',
    subject: 'ELA',
    sections: ['Objective & Anticipatory Set', 'I Do: Teacher Modeling', 'We Do: Guided Practice', 'You Do: Independent Practice', 'Assessment & Closure', 'Differentiated Follow-up'],
    stars: 4.5,
    uses: 3201,
    targetAudience: 'Elementary and middle school teachers focusing on explicit skill instruction',
    materials: ['Anchor chart materials', 'Guided practice worksheets', 'Independent practice activities', 'Formative assessment tools'],
    objectives: ['Master targeted skills through explicit instruction', 'Build confidence through scaffolded practice', 'Demonstrate independent application', 'Identify areas for reteaching and enrichment'],
  },
  {
    id: 6,
    name: 'Inquiry Lab Exploration',
    category: 'Inquiry-Based',
    description:
      'Open-ended laboratory investigation where students design experiments and analyze real-world data. Promotes scientific thinking and experimental design skills.',
    time: '75 min',
    grades: '9-12',
    subject: 'Science',
    sections: ['Phenomenon Introduction', 'Question Formulation', 'Hypothesis & Experimental Design', 'Data Collection & Recording', 'Analysis & Interpretation', 'Conclusion & Communication'],
    stars: 4.7,
    uses: 1382,
    targetAudience: 'High school science teachers promoting student-designed investigations',
    materials: ['Lab equipment and supplies', 'Safety equipment', 'Data recording templates', 'Graphing tools or software'],
    objectives: ['Design controlled experiments', 'Collect and organize quantitative data', 'Analyze results using scientific reasoning', 'Communicate findings effectively'],
  },
  {
    id: 7,
    name: '5E Math Conceptual Lesson',
    category: '5E Model',
    description:
      'Apply the 5E model to mathematics with hands-on manipulatives and conceptual understanding focus. Builds deep mathematical thinking beyond procedural fluency.',
    time: '60 min',
    grades: '3-8',
    subject: 'Mathematics',
    sections: ['Engage: Math Talk & Number Sense', 'Explore: Manipulative Investigation', 'Explain: Concept Formalization', 'Elaborate: Problem Solving Extension', 'Evaluate: Performance Task'],
    stars: 4.6,
    uses: 1764,
    targetAudience: 'Elementary and middle school math teachers emphasizing conceptual understanding',
    materials: ['Math manipulatives (blocks, tiles, etc.)', 'Student math journals', 'Number talk prompts', 'Performance task rubrics'],
    objectives: ['Develop conceptual understanding through exploration', 'Connect concrete, representational, and abstract thinking', 'Apply mathematical reasoning to novel problems', 'Articulate mathematical thinking clearly'],
  },
  {
    id: 8,
    name: 'Socratic Text Analysis',
    category: 'Socratic',
    description:
      'Close reading and Socratic questioning applied to complex texts with layered comprehension activities. Develops analytical reading and discussion skills.',
    time: '55 min',
    grades: '6-12',
    subject: 'ELA',
    sections: ['First Read: Global Comprehension', 'Annotation & Evidence Marking', 'Inner Circle Discussion', 'Outer Circle Observation Notes', 'Synthesis Writing Activity'],
    stars: 4.8,
    uses: 1198,
    targetAudience: 'ELA teachers building close reading and analytical discussion skills',
    materials: ['Selected complex text copies', 'Annotation guides', 'Discussion question stems', 'Synthesis writing prompts'],
    objectives: ['Analyze complex texts through multiple readings', 'Support claims with textual evidence', 'Engage in academic discourse about literature', 'Synthesize ideas through reflective writing'],
  },
]

const recentlyUsed: RecentTemplate[] = [
  { id: 1, name: '5E Science Investigation', category: '5E Model', usedAt: '2 hours ago' },
  { id: 5, name: 'Direct Instruction Mastery', category: 'Direct Instruction', usedAt: 'Yesterday' },
  { id: 2, name: 'Socratic Seminar Discussion', category: 'Socratic', usedAt: '3 days ago' },
]

const communityTemplates: CommunityTemplate[] = [
  {
    id: 101,
    name: 'Gamified Review Station Rotation',
    category: 'Project-Based',
    author: 'Sarah Mitchell',
    school: 'Westfield Academy',
    downloads: 342,
    stars: 4.9,
    description: 'Students rotate through game-based review stations covering key concepts with competitive and collaborative elements.',
  },
  {
    id: 102,
    name: 'Differentiated Reading Workshop',
    category: 'Direct Instruction',
    author: 'James Chen',
    school: 'Lincoln Middle School',
    downloads: 287,
    stars: 4.7,
    description: 'Flexible reading groups with leveled texts, mini-lessons, and conferring schedules for personalized instruction.',
  },
  {
    id: 103,
    name: 'Design Thinking Challenge',
    category: 'Inquiry-Based',
    author: 'Priya Sharma',
    school: 'Innovation STEM Lab',
    downloads: 518,
    stars: 4.8,
    description: 'Human-centered design process applied to real community problems with empathy interviews and rapid prototyping.',
  },
]

/* ---------- stats ---------- */

const stats = [
  { label: 'Templates', value: '8', icon: Layout, color: '#8b5cf6' },
  { label: 'Total Uses', value: '124', icon: Copy, color: '#14b8a6' },
  { label: 'Avg Rating', value: '4.8', icon: Star, color: '#f59e0b' },
  { label: 'Custom', value: '3', icon: Wand2, color: '#ec4899' },
]

/* ---------- helpers ---------- */

const featuredTemplate = templates.find((t) => t.featured)!
const regularTemplates = templates.filter((t) => !t.featured)

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.floor(rating)
              ? 'text-warning fill-warning'
              : i - 0.5 <= rating
                ? 'text-warning fill-warning/50'
                : 'text-surface-600'
          }`}
        />
      ))}
    </div>
  )
}

/* ---------- page component ---------- */

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null)
  const [aiForm, setAiForm] = useState({ subject: '', grade: '', duration: '', style: '' })
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredTemplates = useMemo(() => {
    return regularTemplates.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory
      const matchesSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const handleGenerate = () => {
    setIsGenerating(true)
    showToast('AI lesson template generated!')
    setTimeout(() => setIsGenerating(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
          >
            <CheckCircle className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span className="text-sm font-medium text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Page Header ---- */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Layout className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">Lesson Templates</h1>
                  <span className="text-xs font-bold bg-accent-500/20 text-accent-300 px-2.5 py-0.5 rounded-full">AI-Powered</span>
                </div>
                <p className="text-surface-400 mt-1 text-sm">
                  Ready-to-use lesson frameworks designed by expert educators. Choose a template and customize it for your class.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <button onClick={handleGenerate} className="btn-gradient px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Generate
                </button>
              </motion.div>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Available</span>
              <span className="text-xs font-bold text-white">{regularTemplates.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Filtered</span>
              <span className="text-xs font-bold text-accent-300">{filteredTemplates.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Category</span>
              <span className="text-xs font-bold text-electric-400">{activeCategory}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Featured</span>
              <span className="text-xs font-bold text-neon-400">1</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Community</span>
              <span className="text-xs font-bold text-success-400">3</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ---- Stat Cards ---- */}
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

      {/* ---- Recently Used ---- */}
      <FadeUp delay={0.1}>
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 right-1/4 w-40 h-40 bg-electric-500/[0.04] rounded-full blur-[60px]" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-4 h-4 text-electric-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recently Used</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentlyUsed.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 cursor-pointer group"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)', transition: { duration: 0.18 } }}
                >
                  <div className={`w-2 h-8 rounded-full ${categoryColors[item.category]?.bar ?? 'bg-accent-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-accent-400 transition-colors">{item.name}</p>
                    <p className="text-[11px] text-surface-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.usedAt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-accent-400 transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ---- Search & Category Filter ---- */}
      <FadeUp delay={0.15}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search templates by name, subject, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-10"
            />
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.18}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-surface-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* ---- Featured Template ---- */}
      <FadeUp delay={0.2}>
        <div className="glass-card relative overflow-hidden group">
          {/* Color-coded top bar */}
          <div className={`h-1.5 ${categoryColors[featuredTemplate.category].bar}`} />
          <div className="p-6 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent-500/[0.08] rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 left-1/4 w-56 h-56 bg-electric-500/[0.06] rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-xs font-semibold text-warning uppercase tracking-wider">
                  Most Popular Template
                </span>
              </div>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Preview thumbnail area */}
                <div className="lg:w-56 shrink-0">
                  <div className={`w-full h-36 lg:h-full rounded-xl bg-gradient-to-br ${categoryColors[featuredTemplate.category].gradient} flex items-center justify-center border border-white/[0.06]`}>
                    <div className="text-center">
                      <BookOpen className="w-10 h-10 text-white/30 mx-auto mb-2" />
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Preview</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[featuredTemplate.category].bg} ${categoryColors[featuredTemplate.category].text}`}>
                      {featuredTemplate.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Copy className="w-3 h-3" />
                      {featuredTemplate.uses.toLocaleString()} uses
                    </span>
                    <StarRating rating={featuredTemplate.stars} />
                    <span className="text-xs font-semibold text-warning">{featuredTemplate.stars}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{featuredTemplate.name}</h2>
                  <p className="text-surface-300 text-sm leading-relaxed mb-4">
                    {featuredTemplate.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-surface-400 mb-5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredTemplate.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Grades {featuredTemplate.grades}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {featuredTemplate.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <button className="btn-gradient px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                        Use Template
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <button
                        className="btn-secondary px-4 py-2.5 text-sm font-medium flex items-center gap-2"
                        onClick={() => setExpandedTemplate(expandedTemplate === featuredTemplate.id ? null : featuredTemplate.id)}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </motion.div>
                  </div>
                </div>
                <div className="lg:w-56 shrink-0">
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                      Lesson Structure
                    </h3>
                    <div className="space-y-2">
                      {featuredTemplate.sections.map((section, i) => (
                        <div key={section} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md bg-accent-500/15 flex items-center justify-center text-[10px] font-bold text-accent-400">
                            {i + 1}
                          </div>
                          <span className="text-xs text-surface-300">{section.split(':')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable preview panel for featured */}
              <AnimatePresence>
                {expandedTemplate === featuredTemplate.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                      <ExpandedPreview template={featuredTemplate} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ---- Template Grid ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + searchQuery}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {filteredTemplates.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
                <Search className="w-7 h-7 text-surface-500" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No templates found</h3>
              <p className="text-sm text-surface-400 mb-4">No templates match your current filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" delay={0.07}>
              {filteredTemplates.map((template) => (
                <StaggerItem key={template.id} variants={fadeUp}>
                  <motion.div
                    className="glass-card overflow-hidden h-full flex flex-col"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    {/* Color-coded top bar */}
                    <div className={`h-1.5 ${categoryColors[template.category]?.bar ?? 'bg-accent-500'}`} />

                    {/* Preview thumbnail area */}
                    <div className={`h-28 bg-gradient-to-br ${categoryColors[template.category]?.gradient ?? 'from-accent-500/40 to-accent-600/10'} flex items-center justify-center relative`}>
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-white/20 mx-auto mb-1" />
                        <span className="text-[9px] text-white/30 uppercase tracking-widest font-semibold">{template.subject}</span>
                      </div>
                      {/* Use count badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/70">
                        <Copy className="w-2.5 h-2.5" />
                        {template.uses.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Category badge + rating */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[template.category]?.bg ?? 'bg-accent-500/20'} ${categoryColors[template.category]?.text ?? 'text-accent-400'}`}>
                          {template.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={template.stars} />
                          <span className="text-xs font-semibold text-warning">{template.stars}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white mb-1.5">{template.name}</h3>

                      {/* Description */}
                      <p className="text-sm text-surface-400 leading-relaxed mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-xs text-surface-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {template.grades}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {template.subject}
                        </span>
                      </div>

                      {/* Expandable sections toggle */}
                      <button
                        onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                        className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-300 transition-colors mb-4"
                      >
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedTemplate === template.id ? 'rotate-90' : ''}`}
                        />
                        <Layers className="w-3.5 h-3.5" />
                        <span>{template.sections.length} sections - Click to preview</span>
                      </button>

                      {/* Expandable preview panel */}
                      <AnimatePresence>
                        {expandedTemplate === template.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden mb-4"
                          >
                            <ExpandedPreview template={template} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action buttons */}
                      <div className="mt-auto flex items-center gap-2.5 pt-2">
                        <motion.button
                          className="btn-gradient px-4 py-2 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Use Template
                        </motion.button>
                        <motion.button
                          className="btn-secondary px-3 py-2 text-xs font-medium flex items-center gap-1.5"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ---- Create Custom Template with AI ---- */}
      <FadeInWhenVisible>
        <div className="glass-card relative overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-accent-500 via-electric-500 to-neon-500" />
          <div className="p-6 relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-500/[0.06] rounded-full blur-[80px]" />
              <div className="absolute -bottom-16 left-1/3 w-48 h-48 bg-neon-500/[0.05] rounded-full blur-[60px]" />
              <div className="absolute top-1/2 -left-12 w-36 h-36 bg-electric-500/[0.04] rounded-full blur-[50px]" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500/20 via-neon-500/15 to-electric-500/20 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Create Custom Template</h2>
                  <p className="text-xs text-surface-400">Describe your ideal lesson and AI will generate a tailored template</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5 block">Subject</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                    <input
                      type="text"
                      placeholder="e.g. Biology, Algebra"
                      value={aiForm.subject}
                      onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })}
                      className="input-base pl-9 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5 block">Grade Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                    <input
                      type="text"
                      placeholder="e.g. 7th, 9-12"
                      value={aiForm.grade}
                      onChange={(e) => setAiForm({ ...aiForm, grade: e.target.value })}
                      className="input-base pl-9 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5 block">Duration</label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
                    <input
                      type="text"
                      placeholder="e.g. 45 min, 2 weeks"
                      value={aiForm.duration}
                      onChange={(e) => setAiForm({ ...aiForm, duration: e.target.value })}
                      className="input-base pl-9 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5 block">Teaching Style</label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
                    <select
                      value={aiForm.style}
                      onChange={(e) => setAiForm({ ...aiForm, style: e.target.value })}
                      className="input-base pl-9 pr-8 appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Select style...</option>
                      <option value="inquiry">Inquiry-Based</option>
                      <option value="direct">Direct Instruction</option>
                      <option value="project">Project-Based</option>
                      <option value="flipped">Flipped Classroom</option>
                      <option value="socratic">Socratic Method</option>
                      <option value="5e">5E Model</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <motion.button
                className="btn-gradient px-6 py-3 text-sm font-semibold flex items-center gap-2 relative overflow-hidden"
                onClick={handleGenerate}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                disabled={isGenerating}
              >
                {isGenerating && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Generating Template...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ---- Community Templates ---- */}
      <FadeInWhenVisible delay={0.1}>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 left-1/3 w-48 h-48 bg-neon-500/[0.05] rounded-full blur-[70px]" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-accent-500/[0.04] rounded-full blur-[50px]" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-500/15 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-neon-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Community Templates</h2>
                  <p className="text-xs text-surface-400">Shared by educators worldwide</p>
                </div>
              </div>
              <motion.button
                className="btn-secondary px-4 py-2 text-xs font-medium flex items-center gap-1.5"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse All
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communityTemplates.map((ct, i) => (
                <motion.div
                  key={ct.id}
                  className="glass-card overflow-hidden group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  {/* Color-coded top bar */}
                  <div className={`h-1 ${categoryColors[ct.category]?.bar ?? 'bg-accent-500'}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryColors[ct.category]?.bg ?? 'bg-accent-500/20'} ${categoryColors[ct.category]?.text ?? 'text-accent-400'}`}>
                        {ct.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-semibold text-warning">{ct.stars}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-accent-400 transition-colors">{ct.name}</h3>
                    <p className="text-xs text-surface-400 leading-relaxed mb-3 line-clamp-2">{ct.description}</p>
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-500/30 to-electric-500/20 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">{ct.author.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-surface-300 truncate">{ct.author}</p>
                        <p className="text-[10px] text-surface-500 truncate">{ct.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] text-surface-500">
                        <Download className="w-3 h-3" />
                        {ct.downloads} downloads
                      </span>
                      <motion.button
                        className="btn-primary px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-3 h-3" />
                        Use
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}

/* ---------- Expanded Preview Component ---------- */

function ExpandedPreview({ template }: { template: Template }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Lesson Structure */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-accent-400" />
          <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider">Lesson Structure</h4>
        </div>
        <div className="space-y-2">
          {template.sections.map((section, i) => (
            <div key={section} className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${categoryColors[template.category]?.bg ?? 'bg-accent-500/15'} ${categoryColors[template.category]?.text ?? 'text-accent-400'}`}>
                {i + 1}
              </div>
              <span className="text-xs text-surface-300 leading-relaxed">{section}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-neon-400" />
          <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider">Learning Objectives</h4>
        </div>
        <div className="space-y-2">
          {template.objectives.map((obj) => (
            <div key={obj} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-neon-400 shrink-0 mt-0.5" />
              <span className="text-xs text-surface-300 leading-relaxed">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-electric-400" />
          <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider">Target Audience</h4>
        </div>
        <p className="text-xs text-surface-300 leading-relaxed">{template.targetAudience}</p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
          <span className="text-[10px] text-surface-500 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            Grades {template.grades}
          </span>
          <span className="text-[10px] text-surface-500 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {template.subject}
          </span>
        </div>
      </div>

      {/* Required Materials */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-warning" />
          <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider">Required Materials</h4>
        </div>
        <div className="space-y-2">
          {template.materials.map((mat) => (
            <div key={mat} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warning/60 shrink-0 mt-1.5" />
              <span className="text-xs text-surface-300 leading-relaxed">{mat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
