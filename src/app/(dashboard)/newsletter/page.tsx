'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  Newspaper, Sparkles, Download, Send, RefreshCw, Check,
  Calendar, Users, BookOpen, Star, Image, Clock, ChevronDown,
  Plus, X, Edit, Eye, Copy, Mail, Printer, Award, TrendingUp,
  Camera, Heart, AlertCircle, Zap
} from 'lucide-react'

type Template = 'weekly' | 'monthly' | 'unit' | 'event'
type Section = 'highlights' | 'upcoming' | 'reminders' | 'spotlight' | 'resources' | 'fromDesk'

interface SectionConfig {
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  placeholder: string
}

const sectionConfig: Record<Section, SectionConfig> = {
  fromDesk:   { label: 'From My Desk',      icon: Edit,         color: '#6366f1', placeholder: 'A personal note or message from the teacher…' },
  highlights: { label: 'Class Highlights',   icon: Star,         color: '#f59e0b', placeholder: 'What exciting things happened in class this week?…' },
  upcoming:   { label: 'Upcoming Events',    icon: Calendar,     color: '#22d3ee', placeholder: 'List upcoming tests, projects, events…' },
  reminders:  { label: 'Important Reminders',icon: AlertCircle,  color: '#ef4444', placeholder: 'Reminders about due dates, supplies, permission slips…' },
  spotlight:  { label: 'Student Spotlight',  icon: Award,        color: '#10b981', placeholder: 'Recognize a student or group achievement…' },
  resources:  { label: 'Learning Resources', icon: BookOpen,     color: '#8b5cf6', placeholder: 'Websites, videos, or materials to support home learning…' },
}

const templateConfig: Record<Template, { label: string; desc: string; icon: string; sections: Section[] }> = {
  weekly:  { label: 'Weekly Update',  desc: 'Quick snapshot of the week', icon: '📅', sections: ['fromDesk', 'highlights', 'upcoming', 'reminders'] },
  monthly: { label: 'Monthly Digest', desc: 'Full month recap + preview', icon: '📰', sections: ['fromDesk', 'highlights', 'spotlight', 'upcoming', 'resources'] },
  unit:    { label: 'Unit Wrap-Up',   desc: 'End-of-unit summary',         icon: '📚', sections: ['highlights', 'spotlight', 'resources', 'upcoming'] },
  event:   { label: 'Event Special',  desc: 'Science fair, field trip, etc.', icon: '🎉', sections: ['fromDesk', 'highlights', 'upcoming', 'reminders'] },
}

const sampleContent: Partial<Record<Section, string>> = {
  fromDesk: `Dear Families,\n\nWhat a fantastic week in AP Biology! Our students have been incredible scientists — conducting their photosynthesis labs with real curiosity and care. I'm so proud of each one of them.\n\nAs we wrap up Unit 2 (Genetics), please encourage your student to use the review resources below. Our unit assessment is next Friday, and I'm confident they're ready!\n\nWarm regards,\nMs. Johnson`,
  highlights: `🔬 Lab Success: Students completed their spinach disk experiment and discovered that light intensity directly affects photosynthesis rates. Many students made observations that went beyond the expected results!\n\n✏️ Writing Workshop: AP Biology students drafted their first scientific abstract — a skill they'll use throughout college and careers in science.\n\n🏆 Kahoot Champion: Our Period 4 class broke the class record with a 94% average on Friday's review!`,
  upcoming: `• Friday, Aug 2 – Unit 2 Assessment (Genetics & Heredity)\n• Monday, Aug 5 – Lab Report: Photosynthesis DUE\n• Aug 12–14 – Science Fair Project Proposal Due\n• Aug 20 – Open House (6:00–8:00 PM, Room 214)`,
  reminders: `📌 Lab safety goggles must be in class by Monday — replacements available in the main office for $3.\n📌 Progress reports go home this Friday. Please review and sign.\n📌 Students who missed the lab can make it up during Tuesday lunch (sign up on the door).`,
  spotlight: `🌟 This week's spotlight goes to EMMA JOHNSON (Period 2) for her outstanding scientific method on the photosynthesis lab. Emma's hypothesis was precise, her data collection was meticulous, and her conclusion showed real scientific thinking. Emma, you are a future biologist!`,
  resources: `📖 Khan Academy – Genetics & Heredity: khanacademy.org/genetics\n🎥 Video: "How DNA Makes You Who You Are" (15 min, YouTube)\n📋 Flashcard set on Quizlet: search "Johnson Bio Unit 2"\n📚 Optional enrichment: "The Gene: An Intimate History" by Siddhartha Mukherjee`,
}

const pastNewsletters = [
  { title: 'Weekly Update – July 28',    template: 'weekly', date: 'Jul 28, 2026', opens: 24, color: '#6366f1' },
  { title: 'Unit 1 Wrap-Up: Cell Bio',   template: 'unit',   date: 'Jul 18, 2026', opens: 22, color: '#10b981' },
  { title: 'July Monthly Digest',        template: 'monthly',date: 'Jul 1, 2026',  opens: 21, color: '#f97316' },
  { title: 'Science Fair Kickoff',       template: 'event',  date: 'Jun 20, 2026', opens: 26, color: '#f59e0b' },
]

export default function NewsletterPage() {
  const [template, setTemplate] = useState<Template>('weekly')
  const [activeSections, setActiveSections] = useState<Section[]>(templateConfig.weekly.sections)
  const [expandedSection, setExpandedSection] = useState<Section | null>('fromDesk')
  const [contents, setContents] = useState<Partial<Record<Section, string>>>(sampleContent)
  const [generating, setGenerating] = useState(false)
  const [generatingSection, setGeneratingSection] = useState<Section | null>(null)
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const [className, setClassName] = useState('AP Biology – Period 2')
  const [dateRange, setDateRange] = useState('July 28 – August 1, 2026')

  function handleTemplateChange(t: Template) {
    setTemplate(t)
    setActiveSections(templateConfig[t].sections)
    setExpandedSection(templateConfig[t].sections[0])
  }

  function toggleSection(section: Section) {
    setActiveSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  async function generateSection(section: Section) {
    setGeneratingSection(section)
    await new Promise(r => setTimeout(r, 1800))
    setGeneratingSection(null)
  }

  async function generateAll() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">Newsletter Generator</h1>
              <p className="text-sm text-surface-500">AI-powered parent newsletters — write in seconds, not hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              {(['edit', 'preview'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  {v === 'edit' ? <Edit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {v}
                </button>
              ))}
            </div>
            <button onClick={generateAll} disabled={generating} className="btn-gradient text-sm px-4 py-2 disabled:opacity-50">
              {generating
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                : <><Sparkles className="w-4 h-4" />AI Generate All</>
              }
            </button>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Template Picker */}
          <FadeUp delay={0.05}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Template</p>
              <div className="space-y-2">
                {(Object.entries(templateConfig) as [Template, typeof templateConfig[Template]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${template === key ? 'border-accent-500/30 bg-accent-500/5' : 'border-transparent hover:bg-white/[0.03]'}`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <div>
                      <p className={`text-xs font-semibold ${template === key ? 'text-accent-300' : 'text-surface-200'}`}>{cfg.label}</p>
                      <p className="text-[10px] text-surface-500">{cfg.desc}</p>
                    </div>
                    {template === key && <Check className="w-3.5 h-3.5 text-accent-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Meta Info */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4 space-y-3">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Newsletter Info</p>
              <div>
                <label className="text-[11px] text-surface-500 mb-1 block">Class / Period</label>
                <input
                  type="text"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                />
              </div>
              <div>
                <label className="text-[11px] text-surface-500 mb-1 block">Date Range</label>
                <input
                  type="text"
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                />
              </div>
            </div>
          </FadeUp>

          {/* Sections Toggle */}
          <FadeUp delay={0.15}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Sections</p>
              <div className="space-y-1.5">
                {(Object.entries(sectionConfig) as [Section, SectionConfig][]).map(([key, cfg]) => {
                  const isActive = activeSections.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all ${isActive ? 'bg-white/[0.04]' : 'opacity-50'}`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isActive ? 'border-transparent' : 'border-white/[0.20]'}`}
                           style={isActive ? { background: cfg.color } : {}}>
                        {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <cfg.icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                      <span className="text-xs text-surface-300">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeUp>

          {/* Send Options */}
          <FadeUp delay={0.2}>
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1">Send / Export</p>
              {[
                { label: 'Email Parents',   icon: Mail,    color: '#6366f1' },
                { label: 'Download PDF',   icon: Download, color: '#10b981' },
                { label: 'Print',          icon: Printer,  color: '#f59e0b' },
                { label: 'Copy Link',      icon: Copy,     color: '#22d3ee' },
              ].map(opt => (
                <button key={opt.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-surface-300 hover:bg-white/[0.04] hover:text-white transition-all">
                  <opt.icon className="w-4 h-4" style={{ color: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Main Editor / Preview */}
        <div className="xl:col-span-3">
          {view === 'edit' && (
            <FadeUp delay={0.08}>
              <div className="space-y-3">
                {activeSections.map(section => {
                  const cfg = sectionConfig[section]
                  const isExpanded = expandedSection === section
                  const isGenerating = generatingSection === section
                  return (
                    <motion.div key={section} className="glass-card overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button
                          onClick={() => setExpandedSection(isExpanded ? null : section)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.color + '20' }}>
                            <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
                          </div>
                          <span className="text-sm font-semibold text-surface-200">{cfg.label}</span>
                          {contents[section] && (
                            <span className="text-[10px] text-surface-600 truncate max-w-[200px]">
                              {contents[section]?.slice(0, 60)}…
                            </span>
                          )}
                        </button>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => generateSection(section)}
                            disabled={isGenerating}
                            className="flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 transition-colors disabled:opacity-50"
                          >
                            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Draft
                          </button>
                          <ChevronDown
                            className={`w-4 h-4 text-surface-500 transition-transform cursor-pointer ${isExpanded ? 'rotate-180' : ''}`}
                            onClick={() => setExpandedSection(isExpanded ? null : section)}
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/[0.06]"
                          >
                            <div className="p-4">
                              <textarea
                                value={contents[section] ?? ''}
                                onChange={e => setContents(prev => ({ ...prev, [section]: e.target.value }))}
                                placeholder={cfg.placeholder}
                                rows={section === 'fromDesk' ? 8 : 5}
                                className="w-full px-3 py-2.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.07] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/30 resize-none leading-relaxed"
                                style={{ borderColor: isGenerating ? cfg.color + '30' : undefined }}
                              />
                              {isGenerating && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-surface-500">
                                  <RefreshCw className="w-3 h-3 animate-spin" style={{ color: cfg.color }} />
                                  AI is drafting your {cfg.label.toLowerCase()}…
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                <button
                  onClick={() => {
                    const allSections = Object.keys(sectionConfig) as Section[]
                    const missing = allSections.filter(s => !activeSections.includes(s))
                    if (missing.length) setActiveSections(prev => [...prev, missing[0]])
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-xs text-surface-500 hover:border-accent-500/30 hover:text-accent-400 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </FadeUp>
          )}

          {view === 'preview' && (
            <FadeUp delay={0.08}>
              <div className="glass-card overflow-hidden">
                {/* Newsletter Preview Header */}
                <div className="px-8 py-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">TeachWeaver Classroom</span>
                  </div>
                  <h2 className="text-xl font-bold text-surface-100 mt-2">{templateConfig[template].label}</h2>
                  <p className="text-sm text-surface-400 mt-1">{className} · {dateRange}</p>
                </div>

                <div className="p-8 space-y-6">
                  {activeSections.map(section => {
                    const cfg = sectionConfig[section]
                    const content = contents[section]
                    if (!content) return null
                    return (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: cfg.color + '20' }}>
                            <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                          </div>
                          <h3 className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</h3>
                        </div>
                        <div className="pl-7">
                          <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-line">{content}</p>
                        </div>
                        <div className="mt-4 border-b border-white/[0.05]" />
                      </div>
                    )
                  })}

                  <div className="text-center text-xs text-surface-600 pt-2">
                    Sent with TeachWeaver · {className} · {dateRange}
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </div>

      {/* Past Newsletters */}
      <FadeUp delay={0.35}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-200">Past Newsletters</h3>
            <span className="text-xs text-surface-500">{pastNewsletters.length} sent this semester</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {pastNewsletters.map(nl => (
              <div key={nl.title} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-white/[0.10] transition-colors cursor-pointer group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: nl.color + '20' }}>
                    <Newspaper className="w-3.5 h-3.5" style={{ color: nl.color }} />
                  </div>
                  <span className="text-[10px] text-surface-500">{nl.date}</span>
                </div>
                <p className="text-xs font-semibold text-surface-200 mb-1 group-hover:text-white transition-colors">{nl.title}</p>
                <p className="text-[11px] text-surface-500 capitalize">{nl.template} template</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-surface-500">
                  <Mail className="w-3 h-3" />
                  <span>{nl.opens} opens</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
