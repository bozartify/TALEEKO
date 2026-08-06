'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Newspaper, Sparkles, Download, Send, RefreshCw, Check,
  Calendar, BookOpen, Star, Clock, ChevronDown,
  Plus, X, Edit, Eye, Copy, Mail, Printer, Award, TrendingUp,
  AlertCircle, Zap, Users, BarChart2, Target, ChevronRight, CheckCircle
} from 'lucide-react'

type Template = 'weekly' | 'monthly' | 'unit' | 'event'
type Section = 'highlights' | 'upcoming' | 'reminders' | 'spotlight' | 'resources' | 'fromDesk'
type Tone = 'warm' | 'professional' | 'celebratory' | 'concise'

interface SectionConfig {
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  placeholder: string
}

const sectionConfig: Record<Section, SectionConfig> = {
  fromDesk:   { label: 'From My Desk',        icon: Edit,        color: '#6366f1', placeholder: 'A personal note or message from the teacher…' },
  highlights: { label: 'Class Highlights',     icon: Star,        color: '#f59e0b', placeholder: 'What exciting things happened in class this week?…' },
  upcoming:   { label: 'Upcoming Events',      icon: Calendar,    color: '#22d3ee', placeholder: 'List upcoming tests, projects, events…' },
  reminders:  { label: 'Important Reminders',  icon: AlertCircle, color: '#ef4444', placeholder: 'Reminders about due dates, supplies, permission slips…' },
  spotlight:  { label: 'Student Spotlight',    icon: Award,       color: '#10b981', placeholder: 'Recognize a student or group achievement…' },
  resources:  { label: 'Learning Resources',   icon: BookOpen,    color: '#8b5cf6', placeholder: 'Websites, videos, or materials to support home learning…' },
}

const templateConfig: Record<Template, { label: string; desc: string; icon: string; sections: Section[]; recipients: number }> = {
  weekly:  { label: 'Weekly Update',  desc: 'Quick snapshot of the week',       icon: '📅', sections: ['fromDesk', 'highlights', 'upcoming', 'reminders'], recipients: 24 },
  monthly: { label: 'Monthly Digest', desc: 'Full month recap + preview',        icon: '📰', sections: ['fromDesk', 'highlights', 'spotlight', 'upcoming', 'resources'], recipients: 24 },
  unit:    { label: 'Unit Wrap-Up',   desc: 'End-of-unit summary',               icon: '📚', sections: ['highlights', 'spotlight', 'resources', 'upcoming'], recipients: 24 },
  event:   { label: 'Event Special',  desc: 'Science fair, field trip, etc.',    icon: '🎉', sections: ['fromDesk', 'highlights', 'upcoming', 'reminders'], recipients: 24 },
}

const toneConfig: Record<Tone, { label: string; desc: string; color: string }> = {
  warm:          { label: 'Warm',         desc: 'Friendly, personal tone',      color: '#f97316' },
  professional:  { label: 'Professional', desc: 'Formal, informative tone',     color: '#6366f1' },
  celebratory:   { label: 'Celebratory',  desc: 'Upbeat, congratulatory',       color: '#10b981' },
  concise:       { label: 'Concise',      desc: 'Short, to-the-point',          color: '#22d3ee' },
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
  { title: 'Weekly Update – July 28',  template: 'weekly',  date: 'Jul 28', opens: 24, openRate: 89, color: '#6366f1' },
  { title: 'Unit 1 Wrap-Up: Cell Bio', template: 'unit',    date: 'Jul 18', opens: 22, openRate: 81, color: '#10b981' },
  { title: 'July Monthly Digest',      template: 'monthly', date: 'Jul 1',  opens: 21, openRate: 78, color: '#f97316' },
  { title: 'Science Fair Kickoff',     template: 'event',   date: 'Jun 20', opens: 26, openRate: 96, color: '#f59e0b' },
]

const openRateData = [72, 78, 81, 84, 89]
const openRateLabels = ['Mar', 'Apr', 'May', 'Jun', 'Jul']

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function readingTime(text: string) {
  return Math.ceil(wordCount(text) / 200)
}

export default function NewsletterPage() {
  const [template, setTemplate]             = useState<Template>('weekly')
  const [activeSections, setActiveSections] = useState<Section[]>(templateConfig.weekly.sections)
  const [expandedSection, setExpandedSection] = useState<Section | null>('fromDesk')
  const [contents, setContents]             = useState<Partial<Record<Section, string>>>(sampleContent)
  const [generating, setGenerating]         = useState(false)
  const [generatingSection, setGeneratingSection] = useState<Section | null>(null)
  const [view, setView]                     = useState<'edit' | 'preview'>('edit')
  const [className, setClassName]           = useState('AP Biology – Period 2')
  const [dateRange, setDateRange]           = useState('July 28 – August 1, 2026')
  const [subject, setSubject]               = useState('🔬 This Week in AP Bio: Lab Results + Upcoming Assessment')
  const [tone, setTone]                     = useState<Tone>('warm')
  const [aiOpen, setAiOpen]                 = useState(true)
  const [scheduleOpen, setScheduleOpen]     = useState(false)
  const [sendModal, setSendModal]           = useState(false)
  const [scheduledDate, setScheduledDate]   = useState('')
  const [scheduledTime, setScheduledTime]   = useState('08:00')
  const [sentToast, setSentToast]           = useState(false)
  const [toastMsg, setToastMsg]             = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

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

  function handleSend() {
    setSendModal(false)
    setSentToast(true)
    setTimeout(() => setSentToast(false), 3500)
  }

  const totalWords = activeSections
    .map(s => wordCount(contents[s] ?? ''))
    .reduce((a, b) => a + b, 0)

  const estReadTime = Math.ceil(totalWords / 200)
  const recipientCount = templateConfig[template].recipients
  const completedSections = activeSections.filter(s => (contents[s]?.trim().length ?? 0) > 20).length
  const completionPct = Math.round((completedSections / activeSections.length) * 100)

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Newsletter Generator</h1>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">AI-powered parent newsletters — write in seconds, not hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.06] border border-white/[0.06]">
                {(['edit', 'preview'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}>
                    {v === 'edit' ? <Edit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {v}
                  </button>
                ))}
              </div>
              <button onClick={generateAll} disabled={generating} className="btn-gradient text-xs px-4 py-1.5 disabled:opacity-50">
                {generating ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</> : <><Sparkles className="w-3.5 h-3.5" />AI Generate All</>}
              </button>
              <button onClick={() => setSendModal(true)} className="btn-primary text-xs px-4 py-1.5">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Recipients', value: `${recipientCount}`, color: '#a78bfa' },
              { label: 'Sections', value: `${completedSections}/${activeSections.length}`, color: '#fb923c' },
              { label: 'Words', value: totalWords.toString(), color: '#38bdf8' },
              { label: 'Read Time', value: `~${estReadTime}m`, color: '#34d399' },
              { label: 'Completion', value: `${completionPct}%`, color: completionPct === 100 ? '#4ade80' : '#fbbf24' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-surface-400">{p.label}</span>
                <span className="text-xs font-bold text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* AI Insights */}
      <FadeUp delay={0.04}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setAiOpen(p => !p)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white">AI Newsletter Insights</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-success-400/20 text-success-400">
                {completionPct}% complete
              </span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-4 space-y-2 border-t border-white/[0.06]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {[
                      { label: 'Est. Read Time', value: `~${estReadTime} min`, icon: Clock, color: '#6366f1', sub: `${totalWords} words` },
                      { label: 'Recipients', value: `${recipientCount} families`, icon: Users, color: '#10b981', sub: 'AP Biology Period 2' },
                      { label: 'Avg Open Rate', value: '86%', icon: TrendingUp, color: '#f59e0b', sub: '↑ vs 78% last month' },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: stat.color + '20' }}>
                          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{stat.value}</div>
                          <div className="text-[10px] text-surface-500">{stat.label}</div>
                          <div className="text-[10px] text-surface-600">{stat.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-400/[0.08] border border-accent-400/15">
                    <Target className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-accent-300">Subject Line Optimization</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your subject line is 68 characters — optimal is under 60 for mobile. Try: <strong className="text-white">"🔬 AP Bio: Lab Results + Friday's Test"</strong></p>
                    </div>
                    <button className="text-[10px] font-semibold text-accent-400 hover:text-accent-300 whitespace-nowrap" onClick={() => { setSubject('🔬 AP Bio: Lab Results + Friday\'s Test'); showToast('Subject line updated') }}>Apply →</button>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-400/[0.08] border border-warning-400/15">
                    <Zap className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-warning-300">Add a Student Spotlight</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Newsletters with a Student Spotlight section get 23% higher open rates. Your current template doesn't include one — add it to boost engagement.</p>
                    </div>
                    <button onClick={() => { if (!activeSections.includes('spotlight')) setActiveSections(p => [...p, 'spotlight']) }} className="text-[10px] font-semibold text-warning-400 hover:text-warning-300 whitespace-nowrap">Add →</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="xl:col-span-1 space-y-4">

          {/* Template Picker */}
          <FadeUp delay={0.06}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Template</p>
              <div className="space-y-1.5">
                {(Object.entries(templateConfig) as [Template, typeof templateConfig[Template]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      template === key ? 'border-accent-500/30 bg-accent-500/[0.05]' : 'border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${template === key ? 'text-accent-300' : 'text-surface-200'}`}>{cfg.label}</p>
                      <p className="text-[10px] text-surface-500 truncate">{cfg.desc}</p>
                    </div>
                    {template === key && <Check className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Newsletter Info */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4 space-y-3">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Newsletter Info</p>
              <div>
                <label className="text-[11px] text-surface-500 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                />
                <div className="flex justify-end text-[9px] text-surface-600 mt-0.5">{subject.length}/60 chars</div>
              </div>
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

          {/* Tone Selector */}
          <FadeUp delay={0.14}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Writing Tone</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(toneConfig) as [Tone, typeof toneConfig[Tone]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setTone(key)}
                    className={`px-2 py-2 rounded-xl text-left transition-all border ${
                      tone === key ? 'border-white/[0.12] bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.03]'
                    }`}
                    style={tone === key ? { borderColor: cfg.color + '30' } : {}}
                  >
                    <div
                      className={`text-xs font-semibold ${tone === key ? '' : 'text-surface-300'}`}
                      style={{ color: tone === key ? cfg.color : undefined }}
                    >
                      {cfg.label}
                    </div>
                    <div className="text-[9px] text-surface-600 mt-0.5">{cfg.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Sections Toggle */}
          <FadeUp delay={0.18}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Sections</p>
              <div className="space-y-1.5">
                {(Object.entries(sectionConfig) as [Section, SectionConfig][]).map(([key, cfg]) => {
                  const isActive = activeSections.includes(key)
                  const filled = (contents[key]?.trim().length ?? 0) > 20
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all ${isActive ? 'bg-white/[0.04]' : 'opacity-40 hover:opacity-60'}`}
                    >
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                        style={isActive ? { background: cfg.color, borderColor: cfg.color } : { borderColor: 'rgba(255,255,255,0.2)' }}
                      >
                        {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <cfg.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                      <span className="text-xs text-surface-300 flex-1 text-left">{cfg.label}</span>
                      {isActive && filled && <div className="w-1.5 h-1.5 rounded-full bg-success-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeUp>

          {/* Send / Export */}
          <FadeUp delay={0.22}>
            <div className="glass-card p-4 space-y-1.5">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Send / Export</p>
              {[
                { label: 'Email Parents', icon: Mail, color: '#6366f1', action: () => setSendModal(true) },
                { label: 'Download PDF',  icon: Download, color: '#10b981', action: () => showToast('Newsletter downloaded as PDF') },
                { label: 'Print',         icon: Printer,  color: '#f59e0b', action: () => showToast('Sending to printer…') },
                { label: 'Copy Link',     icon: Copy,     color: '#22d3ee', action: () => showToast('Shareable link copied to clipboard') },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-300 hover:bg-white/[0.04] hover:text-white transition-all"
                >
                  <opt.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Main Editor / Preview */}
        <div className="xl:col-span-3 space-y-4">

          {/* Completion Progress */}
          <FadeUp delay={0.08}>
            <div className="glass-card px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-surface-400">Newsletter completion</span>
                <span className="text-xs font-semibold text-white">{completedSections}/{activeSections.length} sections · {totalWords} words · ~{estReadTime} min read</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </FadeUp>

          {view === 'edit' && (
            <FadeUp delay={0.1}>
              <div className="space-y-3">
                {activeSections.map(section => {
                  const cfg = sectionConfig[section]
                  const isExpanded = expandedSection === section
                  const isGenerating = generatingSection === section
                  const sectionText = contents[section] ?? ''
                  return (
                    <motion.div key={section} className="glass-card overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button
                          onClick={() => setExpandedSection(isExpanded ? null : section)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.color + '20' }}>
                            <cfg.icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                          </div>
                          <span className="text-sm font-semibold text-surface-200">{cfg.label}</span>
                          {sectionText && !isExpanded && (
                            <span className="text-[10px] text-surface-600 truncate max-w-[180px]">
                              {sectionText.slice(0, 55)}…
                            </span>
                          )}
                        </button>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {sectionText && (
                            <span className="text-[9px] text-surface-600">{wordCount(sectionText)}w</span>
                          )}
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
                                value={sectionText}
                                onChange={e => setContents(prev => ({ ...prev, [section]: e.target.value }))}
                                placeholder={cfg.placeholder}
                                rows={section === 'fromDesk' ? 8 : 5}
                                className="w-full px-3 py-2.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.07] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/30 resize-none leading-relaxed"
                                style={isGenerating ? { borderColor: cfg.color + '30' } : {}}
                              />
                              <div className="flex items-center justify-between mt-2">
                                {isGenerating ? (
                                  <span className="flex items-center gap-2 text-xs text-surface-500">
                                    <RefreshCw className="w-3 h-3 animate-spin" style={{ color: cfg.color }} />
                                    Drafting {cfg.label.toLowerCase()}…
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-surface-600">{wordCount(sectionText)} words · ~{readingTime(sectionText)} min</span>
                                )}
                                <button className="text-[10px] text-surface-500 hover:text-surface-300 transition-colors" onClick={() => { setContents(prev => ({ ...prev, [section]: '' })); showToast(`${cfg.label} cleared`) }}>Clear</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                <button
                  onClick={() => {
                    const all = Object.keys(sectionConfig) as Section[]
                    const missing = all.filter(s => !activeSections.includes(s))
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
            <FadeUp delay={0.1}>
              <div className="glass-card overflow-hidden">
                <div
                  className="px-8 py-6 text-center"
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.08))' }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                      <Newspaper className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">TeachWeaver Classroom</span>
                  </div>
                  <h2 className="text-xl font-bold text-surface-100 mt-2">{templateConfig[template].label}</h2>
                  <p className="text-sm text-surface-400 mt-1">{className} · {dateRange}</p>
                  <p className="text-xs text-surface-600 mt-1">Subject: {subject}</p>
                </div>
                <div className="p-8 space-y-6">
                  {activeSections.map(section => {
                    const cfg = sectionConfig[section]
                    const content = contents[section]
                    if (!content?.trim()) return null
                    return (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.color + '20' }}>
                            <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                          </div>
                          <h3 className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</h3>
                        </div>
                        <div className="pl-8">
                          <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-line">{content}</p>
                        </div>
                        <div className="mt-5 border-b border-white/[0.05]" />
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

      {/* Past Newsletters + Open Rate Chart */}
      <FadeInWhenVisible delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-200">Past Newsletters</h3>
              <span className="text-xs text-surface-500">{pastNewsletters.length} sent this semester</span>
            </div>
            <div className="space-y-3">
              {pastNewsletters.map(nl => (
                <div key={nl.title} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group" onClick={() => showToast(`Opening "${nl.title}"…`)}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: nl.color + '20' }}>
                    <Newspaper className="w-4 h-4" style={{ color: nl.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-surface-200 group-hover:text-white transition-colors truncate">{nl.title}</p>
                    <p className="text-[10px] text-surface-500 capitalize mt-0.5">{nl.template} template · {nl.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color: nl.openRate >= 85 ? '#10b981' : '#f59e0b' }}>{nl.openRate}%</div>
                    <div className="text-[10px] text-surface-600">{nl.opens} opens</div>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden flex-shrink-0">
                    <div className="h-full rounded-full" style={{ background: nl.openRate >= 85 ? '#10b981' : '#f59e0b', width: `${nl.openRate}%` }} />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-surface-600 group-hover:text-surface-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-accent-400" />
                Open Rate Trend
              </h3>
              <span className="text-xs text-success-400 font-semibold">↑ +14% this semester</span>
            </div>
            <div className="flex items-end gap-2 h-24 mb-2">
              {openRateData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative" style={{ height: '72px' }}>
                    <motion.div
                      className="absolute bottom-0 w-full rounded-t-sm"
                      style={{ background: i === openRateData.length - 1 ? '#10b981' : 'rgba(255,255,255,0.08)' }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / 100) * 72}px` }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-[9px] text-surface-600">{openRateLabels[i]}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 mt-3 border-t border-white/[0.06] pt-3">
              {[
                { label: 'Best performing', value: 'Student Spotlight issues', color: '#10b981' },
                { label: 'Worst performing', value: 'Reminders-only issues', color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-[10px]">
                  <span className="text-surface-500">{s.label}</span>
                  <span style={{ color: s.color }} className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Send Modal */}
      <AnimatePresence>
        {sendModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSendModal(false)} />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-accent-400" />
                  Send Newsletter
                </h3>
                <button onClick={() => setSendModal(false)} className="text-surface-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                  <Users className="w-4 h-4 text-accent-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">{recipientCount} families</div>
                    <div className="text-[10px] text-surface-500">{className}</div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-surface-500 block mb-1.5">Send time</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScheduleOpen(false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                        !scheduleOpen ? 'bg-accent-500/15 border-accent-500/30 text-accent-300' : 'border-white/[0.08] text-surface-400 hover:text-surface-200'
                      }`}
                    >
                      Send Now
                    </button>
                    <button
                      onClick={() => setScheduleOpen(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                        scheduleOpen ? 'bg-accent-500/15 border-accent-500/30 text-accent-300' : 'border-white/[0.08] text-surface-400 hover:text-surface-200'
                      }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      Schedule
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {scheduleOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[11px] text-surface-500 block mb-1">Date</label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={e => setScheduledDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-surface-500 block mb-1">Time</label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={e => setScheduledTime(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 focus:outline-none focus:border-accent-500/40"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setSendModal(false)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                <button onClick={handleSend} className="btn-gradient text-xs px-4 py-2">
                  <Send className="w-3.5 h-3.5" />
                  {scheduleOpen ? 'Schedule Send' : 'Send Now'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sent Toast */}
      <AnimatePresence>
        {sentToast && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-success-400/20 border border-success-400/30 text-success-300 text-sm font-semibold shadow-xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Check className="w-4 h-4" />
            Newsletter sent to {recipientCount} families!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
          >
            <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
