'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layout,
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
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

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

const categoryColors: Record<string, { bg: string; text: string }> = {
  '5E Model': { bg: 'bg-accent-500/20', text: 'text-accent-400' },
  'Direct Instruction': { bg: 'bg-electric-500/20', text: 'text-electric-400' },
  'Project-Based': { bg: 'bg-neon-500/20', text: 'text-neon-400' },
  'Flipped': { bg: 'bg-success/20', text: 'text-success' },
  'Inquiry-Based': { bg: 'bg-warning/20', text: 'text-warning' },
  'Socratic': { bg: 'bg-danger/20', text: 'text-danger' },
}

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
}

const templates: Template[] = [
  {
    id: 1,
    name: '5E Science Investigation',
    category: '5E Model',
    description:
      'A structured inquiry framework that guides students through scientific discovery using the 5E instructional model.',
    time: '90 min',
    grades: '6-12',
    subject: 'Science',
    sections: ['Engage', 'Explore', 'Explain', 'Elaborate', 'Evaluate'],
    stars: 4.9,
    uses: 2847,
    featured: true,
  },
  {
    id: 2,
    name: 'Socratic Seminar Discussion',
    category: 'Socratic',
    description:
      'Facilitate deep, student-led discussions with structured questioning techniques and collaborative dialogue.',
    time: '60 min',
    grades: '8-12',
    subject: 'Humanities',
    sections: ['Opening Question', 'Core Discussion', 'Closing Reflection', 'Written Response'],
    stars: 4.8,
    uses: 1923,
  },
  {
    id: 3,
    name: 'Project-Based Learning Unit',
    category: 'Project-Based',
    description:
      'Multi-week project framework with milestones, checkpoints, and authentic assessment criteria.',
    time: '2-3 weeks',
    grades: '4-12',
    subject: 'Cross-curricular',
    sections: ['Driving Question', 'Research Phase', 'Prototyping', 'Iteration', 'Presentation'],
    stars: 4.7,
    uses: 2156,
  },
  {
    id: 4,
    name: 'Flipped Classroom Module',
    category: 'Flipped',
    description:
      'Pre-class video content paired with in-class active learning activities and collaborative problem-solving.',
    time: '45 min',
    grades: '7-12',
    subject: 'Mathematics',
    sections: ['Pre-class Video', 'Warm-up Check', 'Guided Practice', 'Independent Work', 'Exit Ticket'],
    stars: 4.6,
    uses: 1547,
  },
  {
    id: 5,
    name: 'Direct Instruction Mastery',
    category: 'Direct Instruction',
    description:
      'Explicit teaching with modeling, guided practice, and independent application for skill mastery.',
    time: '50 min',
    grades: '3-8',
    subject: 'ELA',
    sections: ['Objective & Hook', 'I Do', 'We Do', 'You Do', 'Assessment'],
    stars: 4.5,
    uses: 3201,
  },
  {
    id: 6,
    name: 'Inquiry Lab Exploration',
    category: 'Inquiry-Based',
    description:
      'Open-ended laboratory investigation where students design experiments and analyze real-world data.',
    time: '75 min',
    grades: '9-12',
    subject: 'Science',
    sections: ['Question Formation', 'Hypothesis', 'Experiment Design', 'Data Collection', 'Analysis'],
    stars: 4.7,
    uses: 1382,
  },
  {
    id: 7,
    name: '5E Math Conceptual Lesson',
    category: '5E Model',
    description:
      'Apply the 5E model to mathematics with hands-on manipulatives and conceptual understanding focus.',
    time: '60 min',
    grades: '3-8',
    subject: 'Mathematics',
    sections: ['Engage', 'Explore', 'Explain', 'Elaborate', 'Evaluate'],
    stars: 4.6,
    uses: 1764,
  },
  {
    id: 8,
    name: 'Socratic Text Analysis',
    category: 'Socratic',
    description:
      'Close reading and Socratic questioning applied to complex texts with layered comprehension activities.',
    time: '55 min',
    grades: '6-12',
    subject: 'ELA',
    sections: ['First Read', 'Annotation', 'Inner Circle Discussion', 'Outer Circle Notes', 'Synthesis'],
    stars: 4.8,
    uses: 1198,
  },
]

const featuredTemplate = templates.find((t) => t.featured)!
const regularTemplates = templates.filter((t) => !t.featured)

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({})

  const filteredTemplates = regularTemplates.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSections = (id: number) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-neon-500/[0.04] rounded-full blur-[60px]" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/5 flex items-center justify-center shrink-0">
                <Layout className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Lesson Templates</h1>
                <p className="text-surface-400 mt-1">
                  Ready-to-use lesson frameworks designed by expert educators. Choose a template and customize it for your class.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base pl-9 pr-4 py-2 text-sm w-56"
                />
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="glass-card p-6 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent-500/[0.08] rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 left-1/4 w-56 h-56 bg-electric-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute top-1/2 -left-16 w-40 h-40 bg-neon-500/[0.05] rounded-full blur-[60px]" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-xs font-semibold text-warning uppercase tracking-wider">
                Most Popular Template
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[featuredTemplate.category].bg} ${categoryColors[featuredTemplate.category].text}`}
                  >
                    {featuredTemplate.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-surface-500">
                    <Copy className="w-3 h-3" />
                    {featuredTemplate.uses.toLocaleString()} uses
                  </span>
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
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    {featuredTemplate.stars}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-gradient px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary px-4 py-2.5 text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
              <div className="lg:w-64 shrink-0">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    Template Sections
                  </h3>
                  <div className="space-y-2">
                    {featuredTemplate.sections.map((section, i) => (
                      <div key={section} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-accent-500/15 flex items-center justify-center text-[10px] font-bold text-accent-400">
                          {i + 1}
                        </div>
                        <span className="text-sm text-surface-300">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + searchQuery}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" delay={0.07}>
            {filteredTemplates.map((template) => (
              <StaggerItem key={template.id} variants={fadeUp}>
                <motion.div
                  className="glass-card p-5 h-full flex flex-col"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[template.category].bg} ${categoryColors[template.category].text}`}
                    >
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-surface-500">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span>{template.stars}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{template.name}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-surface-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {template.grades}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {template.subject}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSections(template.id)}
                    className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-300 transition-colors mb-4"
                  >
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${expandedSections[template.id] ? 'rotate-90' : ''}`}
                    />
                    <Layers className="w-3.5 h-3.5" />
                    <span>{template.sections.length} sections</span>
                  </button>

                  <AnimatePresence>
                    {expandedSections[template.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-1.5">
                          {template.sections.map((section, i) => (
                            <div key={section} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-accent-500/15 flex items-center justify-center text-[9px] font-bold text-accent-400">
                                {i + 1}
                              </div>
                              <span className="text-xs text-surface-300">{section}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto flex items-center gap-2.5 pt-2">
                    <button className="btn-gradient px-4 py-2 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Use Template
                    </button>
                    <button className="btn-secondary px-3 py-2 text-xs font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}

            <StaggerItem variants={fadeUp}>
              <motion.div
                className="glass-card p-5 h-full flex flex-col items-center justify-center text-center border border-dashed border-white/[0.08] min-h-[320px]"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500/20 via-neon-500/15 to-electric-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-accent-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">AI Custom Template</h3>
                <p className="text-sm text-surface-400 leading-relaxed mb-5 max-w-[240px]">
                  Describe your ideal lesson structure and AI will generate a custom template tailored to your needs.
                </p>
                <button className="btn-gradient px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Template
                </button>
              </motion.div>
            </StaggerItem>
          </StaggerList>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
