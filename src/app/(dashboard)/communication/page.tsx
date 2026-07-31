'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, MessageSquare, Users, Bell, Send, Plus, Search,
  ChevronRight, Clock, Star, Paperclip, Check, CheckCheck,
  Phone, Video, Globe, Calendar, FileText, AlertTriangle,
  Sparkles, Filter, ChevronDown, ChevronUp, X, Archive,
  Flag, Bookmark, Reply, Forward, Eye, Zap, TrendingUp,
  BarChart3, Tag, AtSign, Languages, MoreHorizontal, Image
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

interface Conversation {
  id: string
  parent: string
  student: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  class: string
  color: string
  priority?: boolean
  starred?: boolean
  ell?: boolean
  label?: string
  thread?: Message[]
}

interface Message {
  id: string
  from: 'teacher' | 'parent'
  text: string
  time: string
  read?: boolean
}

interface Template {
  id: string
  name: string
  icon: string
  desc: string
  category: string
  body: string
}

type Tab = 'inbox' | 'compose' | 'templates' | 'sent'
type FilterChip = 'all' | 'unread' | 'starred' | 'priority'

const CONVERSATIONS: Conversation[] = [
  {
    id: '1', parent: 'Maria Rodriguez', student: 'Emma Rodriguez', avatar: 'MR',
    lastMessage: 'Thank you for the update on Emma\'s progress in Science!',
    time: '2h ago', unread: 0, class: '7th Science', color: '#8b5cf6', starred: true,
    label: 'positive',
    thread: [
      { id: 'm1', from: 'teacher', text: 'Hi Maria, I wanted to share a quick update on Emma\'s exceptional work this week. She scored 96% on the ecosystem lab and her critical thinking has been outstanding.', time: '3h ago', read: true },
      { id: 'm2', from: 'parent', text: 'Thank you for the update on Emma\'s progress in Science! We\'re so proud of her hard work this semester.', time: '2h ago', read: true },
    ]
  },
  {
    id: '2', parent: 'David Kim', student: 'James Kim', avatar: 'DK',
    lastMessage: 'Can we schedule a meeting about the history project?',
    time: '4h ago', unread: 2, class: '8th History', color: '#f97316', priority: true,
    label: 'meeting',
    thread: [
      { id: 'm3', from: 'parent', text: 'Hello, I\'ve been reviewing the rubric for the history project and I have some questions. Is there a good time to connect?', time: '5h ago', read: false },
      { id: 'm4', from: 'parent', text: 'Can we schedule a meeting about the history project?', time: '4h ago', read: false },
    ]
  },
  {
    id: '3', parent: 'Fatima Patel', student: 'Sofia Patel', avatar: 'FP',
    lastMessage: 'Sofia mentioned she needs extra help with the lab report.',
    time: 'Yesterday', unread: 1, class: '7th Science', color: '#8b5cf6', ell: true,
    label: 'support',
    thread: [
      { id: 'm5', from: 'parent', text: 'Sofia mentioned she needs extra help with the lab report. Could she come in during lunch for some additional guidance?', time: 'Yesterday', read: false },
    ]
  },
  {
    id: '4', parent: 'John Williams', student: 'Noah Williams', avatar: 'JW',
    lastMessage: 'Is there extra credit available for the history class?',
    time: '2d ago', unread: 0, class: '8th History', color: '#f97316',
    thread: [
      { id: 'm6', from: 'parent', text: 'Noah has been working extra hard lately. Is there any extra credit available for the history class?', time: '2d ago', read: true },
    ]
  },
  {
    id: '5', parent: 'Linda Chen', student: 'Liam Chen', avatar: 'LC',
    lastMessage: 'Thanks for sending the study guide. Very helpful!',
    time: '3d ago', unread: 0, class: '10th English', color: '#f43f5e', starred: true,
    thread: [
      { id: 'm7', from: 'teacher', text: 'Hi Linda, here\'s the study guide I mentioned for the upcoming unit on World Literature. Let me know if Liam has any questions.', time: '4d ago', read: true },
      { id: 'm8', from: 'parent', text: 'Thanks for sending the study guide. Very helpful! Liam has already started reviewing it.', time: '3d ago', read: true },
    ]
  },
]

const SENT_MESSAGES = [
  { id: 's1', to: 'All Parents — 7th Science', subject: 'Weekly Progress Update', time: '2h ago', opens: 18, total: 24 },
  { id: 's2', to: 'Maria Rodriguez', subject: 'Emma\'s Lab Excellence', time: 'Yesterday', opens: 1, total: 1 },
  { id: 's3', to: 'All Parents — 8th History', subject: 'Project Rubric + Due Date Reminder', time: '2d ago', opens: 31, total: 37 },
  { id: 's4', to: 'Linda Chen', subject: 'World Literature Study Guide', time: '4d ago', opens: 1, total: 1 },
]

const TEMPLATES: Template[] = [
  {
    id: 't1', name: 'Weekly Progress Report', icon: '📊', desc: 'Auto-generated student progress summary', category: 'Updates',
    body: 'Dear [Parent Name],\n\nI hope this week has been going well for your family. I wanted to take a moment to share [Student Name]\'s progress update for the week of [Date].\n\n[Student Name] has been demonstrating [positive qualities] in class. Their current grade is [Grade], and they have [X] assignments completed out of [Y] total.\n\nAreas of strength: [List strengths]\nFocus areas: [List focus areas]\n\nPlease feel free to reach out with any questions.\n\nWarm regards,\n[Teacher Name]'
  },
  {
    id: 't2', name: 'Parent-Teacher Conference', icon: '🤝', desc: 'Meeting invitation with agenda', category: 'Meetings',
    body: 'Dear [Parent Name],\n\nI would love to schedule a parent-teacher conference to discuss [Student Name]\'s progress. These conversations are invaluable in supporting student success.\n\nProposed times:\n• [Date 1] at [Time]\n• [Date 2] at [Time]\n• [Date 3] at [Time]\n\nThe meeting will cover academic progress, social-emotional wellbeing, and goals for the remainder of the semester.\n\nPlease reply with your preferred time.\n\nBest regards,\n[Teacher Name]'
  },
  {
    id: 't3', name: 'Assignment Reminder', icon: '⏰', desc: 'Upcoming due dates and requirements', category: 'Reminders',
    body: 'Dear [Parent Name],\n\nThis is a friendly reminder that [Student Name] has the following upcoming assignments:\n\n📚 [Assignment 1] — Due [Date]\n📝 [Assignment 2] — Due [Date]\n\nPlease encourage [Student Name] to begin early if they haven\'t already. All materials and instructions are available on [Platform].\n\nThank you for your continued partnership!\n\n[Teacher Name]'
  },
  {
    id: 't4', name: 'Positive Feedback', icon: '⭐', desc: 'Celebrate student achievements', category: 'Recognition',
    body: 'Dear [Parent Name],\n\nI just had to share some wonderful news about [Student Name]! Today they [specific achievement or behavior].\n\nThis kind of [effort/creativity/kindness/perseverance] is exactly what makes our classroom community special. You should be very proud!\n\n[Student Name] is making a real difference and growing every day.\n\nWarm regards,\n[Teacher Name]'
  },
  {
    id: 't5', name: 'Behavior Notice', icon: '📋', desc: 'Behavioral observation report', category: 'Support',
    body: 'Dear [Parent Name],\n\nI\'m reaching out to discuss a behavioral observation regarding [Student Name]. I want to address this early so we can support them together.\n\nObservation: [Description of behavior]\nDate/Context: [When it occurred]\nImpact: [How it affected learning]\n\nI believe with consistent support both at home and at school, we can help [Student Name] develop the skills to navigate these situations positively.\n\nCould we find a time to discuss strategies?\n\n[Teacher Name]'
  },
  {
    id: 't6', name: 'Field Trip Permission', icon: '🚌', desc: 'Permission slip and details', category: 'Events',
    body: 'Dear [Parent Name],\n\nWe are excited to announce an upcoming field trip for [Class Name]!\n\n📍 Destination: [Location]\n📅 Date: [Date]\n🕗 Departure: [Time] | Return: [Time]\n💰 Cost: [Amount]\n\nThis trip supports our current unit on [Topic] and will be an enriching hands-on experience.\n\nPlease sign and return the attached permission form by [Deadline]. Contact me with any questions or dietary/medical needs.\n\n[Teacher Name]'
  },
  {
    id: 't7', name: 'Academic Concern', icon: '📉', desc: 'Early intervention outreach', category: 'Support',
    body: 'Dear [Parent Name],\n\nI\'m reaching out because I\'ve noticed [Student Name] has been struggling with [Subject/Topic] recently. I want to connect early so we can work together to get them back on track.\n\nCurrent concern: [Description]\nGrade impact: [If applicable]\nSupport already offered: [List]\n\nI recommend: [Tutoring / Extra sessions / Practice materials]\n\nI\'m confident that with the right support, [Student Name] can absolutely turn this around. Let\'s connect soon.\n\n[Teacher Name]'
  },
  {
    id: 't8', name: 'ELL Family Outreach', icon: '🌐', desc: 'Culturally responsive family communication', category: 'Inclusion',
    body: 'Dear [Parent Name],\n\nThank you for partnering with us in [Student Name]\'s education. We deeply value your family\'s background and want to ensure you are always informed and welcomed.\n\n[Student Name] is making wonderful progress, especially considering the additional challenge of learning in a new language. We are very proud!\n\nIf you ever need translation support or have questions you\'d feel more comfortable discussing in [Home Language], please let us know — we are here for you.\n\nWith appreciation,\n[Teacher Name]'
  },
]

const RESPONSE_RATE_DATA = [88, 91, 90, 94, 96]
const RESPONSE_RATE_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul']

const LABEL_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  positive: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Positive' },
  meeting: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Meeting' },
  support: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', label: 'Support' },
  urgent: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Urgent' },
}

export default function CommunicationPage() {
  const [tab, setTab] = useState<Tab>('inbox')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterChip>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [threads, setThreads] = useState<Record<string, Message[]>>(
    Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.thread ?? []]))
  )
  const [aiOpen, setAiOpen] = useState(false)
  const [aiDraft, setAiDraft] = useState(false)
  const [ellTranslate, setEllTranslate] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [composePriority, setComposePriority] = useState(false)
  const [scheduleMode, setScheduleMode] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [sentToast, setSentToast] = useState(false)
  const [templatePreview, setTemplatePreview] = useState<Template | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkToast, setBulkToast] = useState(false)
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const messageEndRef = useRef<HTMLDivElement>(null)

  const selectedConv = conversations.find(c => c.id === selectedId)
  const currentThread = selectedId ? (threads[selectedId] ?? []) : []

  const filtered = conversations.filter(c => {
    const q = search.toLowerCase()
    const matchesSearch = !search ||
      c.parent.toLowerCase().includes(q) ||
      c.student.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && c.unread > 0) ||
      (filter === 'starred' && c.starred) ||
      (filter === 'priority' && c.priority)
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, currentThread.length])

  function sendReply() {
    if (!replyText.trim() || !selectedId) return
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: 'teacher',
      text: replyText,
      time: 'just now',
      read: true,
    }
    setThreads(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), msg] }))
    setConversations(prev => prev.map(c =>
      c.id === selectedId ? { ...c, lastMessage: replyText, time: 'just now', unread: 0 } : c
    ))
    setReplyText('')
  }

  function sendCompose() {
    setComposeTo('')
    setComposeSubject('')
    setComposeBody('')
    setComposePriority(false)
    setScheduleMode(false)
    setSentToast(true)
    setTimeout(() => setSentToast(false), 3500)
    setTab('sent')
  }

  function applyTemplate(t: Template) {
    setComposeBody(t.body)
    setTemplatePreview(null)
    setTab('compose')
  }

  function toggleSelected(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function bulkSend() {
    setBulkMode(false)
    setSelected(new Set())
    setBulkToast(true)
    setTimeout(() => setBulkToast(false), 3500)
  }

  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0)

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <AnimatePresence>
        {sentToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border border-success-500/30"
            style={{ background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(16px)' }}
          >
            <Check className="w-4 h-4 text-success-400" />
            <span className="text-sm font-semibold text-success-300">
              {scheduleMode ? 'Message scheduled successfully' : 'Message sent successfully'}
            </span>
          </motion.div>
        )}
        {bulkToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border border-accent-500/30"
            style={{ background: 'rgba(99,102,241,0.15)', backdropFilter: 'blur(16px)' }}
          >
            <Check className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-semibold text-accent-300">
              Bulk message sent to {selected.size} families
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {templatePreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTemplatePreview(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl mr-2">{templatePreview.icon}</span>
                  <span className="text-base font-bold text-white">{templatePreview.name}</span>
                </div>
                <button onClick={() => setTemplatePreview(null)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 mb-4">
                <pre className="text-xs text-surface-300 whitespace-pre-wrap font-sans leading-relaxed">{templatePreview.body}</pre>
              </div>
              <div className="flex gap-2">
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyTemplate(templatePreview)}
                >
                  <Send className="w-3.5 h-3.5" />
                  Use Template
                </motion.button>
                <button
                  className="btn-secondary text-xs px-4"
                  onClick={() => setTemplatePreview(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'Messages Sent', value: '47', icon: Send, color: 'bg-accent-500/20 text-accent-400', delta: 'This month', trend: '+12%' },
          { label: 'Response Rate', value: '94%', icon: CheckCheck, color: 'bg-success-500/20 text-success-400', delta: 'Parent responses', trend: '+3%' },
          { label: 'Active Parents', value: '89', icon: Users, color: 'bg-electric-500/20 text-electric-400', delta: 'Out of 113 total', trend: '79%' },
          { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'bg-warning-500/20 text-warning-400', delta: 'Industry avg: 6h', trend: '-1.2h' },
        ].map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-surface-500">{s.delta}</span>
                <span className="text-[10px] font-bold text-success-400">{s.trend}</span>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* AI Insights Panel */}
      <FadeUp delay={0.1}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Communication Insights</span>
              <span className="bg-accent-500/20 text-accent-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 alerts</span>
            </div>
            {aiOpen ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
          </button>
          <AnimatePresence>
            {aiOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-500/[0.08] border border-warning-500/20">
                    <AlertTriangle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">2 Unreplied Priority Messages</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">David Kim & Fatima Patel have been waiting 4h+. Responding within 24h increases trust by 67%.</p>
                      <button className="text-[10px] text-warning-400 font-semibold mt-1 hover:underline" onClick={() => { setFilter('unread'); setTab('inbox') }}>View unread →</button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-500/[0.08] border border-accent-500/20">
                    <TrendingUp className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-accent-300">Response Rate Trending Up</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Your response rate climbed from 88% → 94% over 5 months. You're in the top 8% of teachers on this platform.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-electric-500/[0.08] border border-electric-500/20">
                    <Globe className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-electric-300">ELL Family: Auto-Translate Ready</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">Sofia Patel's family prefers Gujarati. Enable auto-translate on their thread for a 3× engagement boost.</p>
                      <button className="text-[10px] text-electric-400 font-semibold mt-1 hover:underline" onClick={() => { setSelectedId('3'); setEllTranslate(true); setTab('inbox') }}>Enable for this family →</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      {/* Tabs + actions */}
      <FadeUp delay={0.15}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1">
            {([
              { key: 'inbox' as const, label: 'Inbox', icon: Mail, count: unreadCount },
              { key: 'compose' as const, label: 'Compose', icon: Send },
              { key: 'templates' as const, label: 'Templates', icon: FileText },
              { key: 'sent' as const, label: 'Sent', icon: CheckCheck },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  tab === t.key ? 'bg-white/[0.1] text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
                {!!t.count && t.count > 0 && (
                  <span className="bg-danger-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                bulkMode ? 'bg-accent-500/20 text-accent-300' : 'btn-secondary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setBulkMode(b => !b); setSelected(new Set()) }}
            >
              <Users className="w-3.5 h-3.5" />
              {bulkMode ? 'Cancel Bulk' : 'Bulk Send'}
            </motion.button>
            <motion.button
              className="btn-gradient text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab('compose')}
            >
              <Plus className="w-3.5 h-3.5" />
              New Message
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {bulkMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-surface-400">
                  {selected.size > 0 ? (
                    <span className="text-accent-300 font-semibold">{selected.size} families selected</span>
                  ) : 'Select families from inbox to send a bulk message'}
                </span>
              </div>
              <AnimatePresence>
                {selected.size > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="btn-gradient text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={bulkSend}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send to {selected.size} Families
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Inbox */}
        {tab === 'inbox' && (
          <motion.div
            key="inbox"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Conversation list */}
            <div className="lg:col-span-1 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-full transition-all"
                />
              </div>
              {/* Filter chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {([
                  { key: 'all' as const, label: 'All' },
                  { key: 'unread' as const, label: `Unread (${unreadCount})` },
                  { key: 'starred' as const, label: 'Starred' },
                  { key: 'priority' as const, label: 'Priority' },
                ] as const).map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                      filter === f.key
                        ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                        : 'text-surface-400 hover:text-surface-300 border border-transparent hover:border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {/* List */}
              <div className="glass-card overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-surface-500 text-xs">No conversations match your filter</div>
                ) : filtered.map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    className={`w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0 ${
                      selectedId === conv.id ? 'bg-accent-500/10' : ''
                    }`}
                    onClick={() => {
                      if (bulkMode) { toggleSelected(conv.id) } else { setSelectedId(conv.id) }
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {bulkMode && (
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                        selected.has(conv.id) ? 'bg-accent-500 border-accent-500' : 'border-surface-600'
                      }`}>
                        {selected.has(conv.id) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 relative"
                      style={{ background: `linear-gradient(135deg,${conv.color},${conv.color}dd)` }}
                    >
                      {conv.avatar}
                      {conv.ell && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-electric-500 flex items-center justify-center">
                          <Globe className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className={`text-xs font-semibold truncate ${conv.unread > 0 ? 'text-white' : 'text-surface-200'}`}>
                            {conv.parent}
                          </p>
                          {conv.priority && <Flag className="w-3 h-3 text-danger-400 flex-shrink-0" />}
                          {conv.starred && <Star className="w-3 h-3 text-warning-400 flex-shrink-0" />}
                        </div>
                        <span className="text-[10px] text-surface-500 flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-[10px] text-accent-400 font-medium">{conv.student} · {conv.class}</p>
                      <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'text-surface-300 font-medium' : 'text-surface-500'}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.label && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: LABEL_CONFIG[conv.label]?.bg, color: LABEL_CONFIG[conv.label]?.color }}
                        >
                          {LABEL_CONFIG[conv.label]?.label}
                        </span>
                      )}
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-accent-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Thread view */}
            <div className="lg:col-span-2">
              {selectedConv ? (
                <div className="glass-card overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
                  {/* Thread header */}
                  <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `linear-gradient(135deg,${selectedConv.color},${selectedConv.color}dd)` }}
                      >
                        {selectedConv.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{selectedConv.parent}</p>
                          {selectedConv.priority && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-danger-500/20 text-danger-400">Priority</span>
                          )}
                        </div>
                        <p className="text-xs text-surface-400">Parent of {selectedConv.student} · {selectedConv.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedConv.ell && (
                        <motion.button
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                            ellTranslate ? 'bg-electric-500/20 text-electric-300' : 'text-surface-500 hover:bg-white/[0.06]'
                          }`}
                          onClick={() => setEllTranslate(t => !t)}
                          whileHover={{ scale: 1.03 }}
                          title="Auto-translate for ELL family"
                        >
                          <Languages className="w-3.5 h-3.5" />
                          Translate
                        </motion.button>
                      )}
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Phone className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Video className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* ELL banner */}
                  <AnimatePresence>
                    {selectedConv.ell && ellTranslate && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-2.5 flex items-center gap-2 bg-electric-500/10 border-b border-electric-500/20">
                          <Languages className="w-3.5 h-3.5 text-electric-400" />
                          <span className="text-[11px] text-electric-300 font-medium">Auto-translate active — messages will be translated to Gujarati for this family</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '340px' }}>
                    {currentThread.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        className={`flex gap-3 ${msg.from === 'teacher' ? 'flex-row-reverse' : ''}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={msg.from === 'teacher'
                            ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }
                            : { background: `linear-gradient(135deg,${selectedConv.color},${selectedConv.color}dd)` }
                          }
                        >
                          {msg.from === 'teacher' ? 'AJ' : selectedConv.avatar}
                        </div>
                        <div className={`max-w-sm ${msg.from === 'teacher' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-4 py-2.5 rounded-2xl ${
                            msg.from === 'teacher'
                              ? 'bg-accent-500/20 border border-accent-500/20 rounded-tr-sm'
                              : 'bg-white/[0.06] border border-white/[0.06] rounded-tl-sm'
                          }`}>
                            <p className="text-sm text-surface-200 leading-relaxed">{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 mt-1 ${msg.from === 'teacher' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-surface-500">{msg.time}</span>
                            {msg.from === 'teacher' && (
                              <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-accent-400' : 'text-surface-500'}`} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Reply bar */}
                  <div className="p-4 border-t border-white/[0.06]">
                    <AnimatePresence>
                      {aiDraft && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-3"
                        >
                          <div className="bg-accent-500/[0.08] border border-accent-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Sparkles className="w-3 h-3 text-accent-400" />
                              <span className="text-[10px] font-bold text-accent-400">AI Draft Suggestion</span>
                            </div>
                            <p className="text-xs text-surface-300 leading-relaxed">
                              Thank you for reaching out, {selectedConv.parent}. I appreciate your concern for {selectedConv.student}&apos;s learning. I&apos;d be happy to schedule a time to connect — please let me know your availability this week.
                            </p>
                            <button
                              className="text-[10px] text-accent-400 font-semibold mt-2 hover:underline"
                              onClick={() => { setReplyText(`Thank you for reaching out, ${selectedConv.parent}. I appreciate your concern for ${selectedConv.student}'s learning. I'd be happy to schedule a time to connect — please let me know your availability this week.`); setAiDraft(false) }}
                            >
                              Use this draft →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a reply..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendReply()}
                        className="flex-1 px-4 py-2.5 text-sm rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                      <button className="p-2.5 rounded-full text-surface-500 hover:text-surface-200 hover:bg-white/[0.06]"><Paperclip className="w-4 h-4" /></button>
                      <motion.button
                        className={`p-2.5 rounded-full transition-colors ${aiDraft ? 'text-accent-400 bg-accent-500/10' : 'text-surface-500 hover:text-accent-400 hover:bg-accent-500/10'}`}
                        title="AI Draft"
                        onClick={() => setAiDraft(d => !d)}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="btn-primary p-2.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendReply}
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 text-center" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-accent-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Select a conversation</h3>
                  <p className="text-sm text-surface-400">Choose a parent to view the thread</p>
                  <p className="text-xs text-surface-500 mt-1">{unreadCount} unread messages</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Compose */}
        {tab === 'compose' && (
          <motion.div
            key="compose"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-white">New Message</h3>
                  <div className="flex items-center gap-2">
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        composePriority ? 'bg-danger-500/20 text-danger-400' : 'text-surface-400 hover:bg-white/[0.06]'
                      }`}
                      onClick={() => setComposePriority(p => !p)}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      {composePriority ? 'Priority' : 'Mark Priority'}
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 mb-1.5">To (Parent / Class Group)</label>
                      <select
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        value={composeTo}
                        onChange={e => setComposeTo(e.target.value)}
                      >
                        <option value="">Select recipient...</option>
                        {CONVERSATIONS.map(c => (
                          <option key={c.id} value={c.id}>{c.parent} ({c.student})</option>
                        ))}
                        <option value="all-science">All Parents — 7th Science (24)</option>
                        <option value="all-history">All Parents — 8th History (37)</option>
                        <option value="all-english">All Parents — 10th English (29)</option>
                        <option value="all">All Parents — All Classes (90)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-300 mb-1.5">Use Template</label>
                      <select
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        onChange={e => {
                          const t = TEMPLATES.find(t => t.id === e.target.value)
                          if (t) setComposeBody(t.body)
                        }}
                      >
                        <option value="">No template</option>
                        {TEMPLATES.map(t => (
                          <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      placeholder="Message subject..."
                      value={composeSubject}
                      onChange={e => setComposeSubject(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-surface-300">Message</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-surface-500">{composeBody.length} chars</span>
                        <motion.button
                          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                            aiDraft ? 'text-accent-300' : 'text-accent-400 hover:text-accent-300'
                          }`}
                          onClick={() => {
                            setAiDraft(true)
                            setComposeBody(`Dear [Parent Name],\n\nI hope this message finds you well. I wanted to reach out regarding [Student Name]'s progress and share some exciting developments from our recent class sessions.\n\n[Student Name] has been demonstrating exceptional dedication and growth in [Subject]. Their engagement with the material has been inspiring to witness, and I'm proud of the strides they've made this term.\n\nAreas of particular strength:\n• [Strength 1]\n• [Strength 2]\n\nI'd love to continue this positive momentum. Please don't hesitate to reach out with any questions or to schedule a time to connect.\n\nWarm regards,\n[Your Name]`)
                          }}
                          whileHover={{ scale: 1.03 }}
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Draft
                        </motion.button>
                      </div>
                    </div>
                    <textarea
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 h-52 resize-none"
                      placeholder="Type your message..."
                      value={composeBody}
                      onChange={e => setComposeBody(e.target.value)}
                    />
                  </div>
                  {/* Schedule toggle */}
                  <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <button
                      onClick={() => setScheduleMode(s => !s)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${scheduleMode ? 'text-accent-300' : 'text-surface-400 hover:text-surface-200'}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {scheduleMode ? 'Scheduled Send' : 'Send Now'}
                    </button>
                    <AnimatePresence>
                      {scheduleMode && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center gap-2 overflow-hidden"
                        >
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={e => setScheduledDate(e.target.value)}
                            className="px-2 py-1 text-xs rounded-lg border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-1 focus:ring-accent-500"
                          />
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={e => setScheduledTime(e.target.value)}
                            className="px-2 py-1 text-xs rounded-lg border border-white/[0.08] bg-white/[0.04] text-surface-200 focus:outline-none focus:ring-1 focus:ring-accent-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500" title="Attach file"><Paperclip className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500" title="Attach image"><Image className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500" title="Translate to ELL family language"><Globe className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary text-xs px-4 py-2">Save Draft</button>
                      <motion.button
                        className="btn-gradient text-xs"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={sendCompose}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {scheduleMode ? 'Schedule' : 'Send Message'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compose Sidebar */}
            <div className="space-y-4">
              {/* Recipient preview */}
              {composeTo && (
                <FadeInWhenVisible>
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-1.5">
                      <AtSign className="w-3.5 h-3.5 text-accent-400" />
                      Recipient Preview
                    </h4>
                    {['all-science', 'all-history', 'all-english', 'all'].includes(composeTo) ? (
                      <div>
                        <p className="text-sm font-bold text-white">
                          {composeTo === 'all' ? 'All Parents (90)' :
                           composeTo === 'all-science' ? '7th Science Families (24)' :
                           composeTo === 'all-history' ? '8th History Families (37)' :
                           '10th English Families (29)'}
                        </p>
                        <p className="text-[10px] text-surface-400 mt-0.5">Bulk message — personalized placeholders will auto-fill</p>
                      </div>
                    ) : (
                      (() => {
                        const c = CONVERSATIONS.find(c => c.id === composeTo)
                        return c ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg,${c.color},${c.color}dd)` }}>
                              {c.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{c.parent}</p>
                              <p className="text-[10px] text-surface-400">Parent of {c.student} · {c.class}</p>
                            </div>
                          </div>
                        ) : null
                      })()
                    )}
                  </div>
                </FadeInWhenVisible>
              )}

              {/* Quick templates */}
              <div className="glass-card p-4">
                <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent-400" />
                  Quick Templates
                </h4>
                <div className="space-y-1.5">
                  {TEMPLATES.slice(0, 4).map(t => (
                    <button
                      key={t.id}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-left"
                      onClick={() => setComposeBody(t.body)}
                    >
                      <span className="text-base">{t.icon}</span>
                      <div>
                        <p className="text-[11px] font-semibold text-surface-200">{t.name}</p>
                        <p className="text-[9px] text-surface-500">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="glass-card p-4">
                <h4 className="text-xs font-bold text-surface-300 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  AI Writing Tips
                </h4>
                <div className="space-y-2 text-[10px] text-surface-400">
                  <p>✦ Start with a personal detail about the student to grab attention</p>
                  <p>✦ Messages under 200 words have 43% higher response rates</p>
                  <p>✦ End with a clear call-to-action or question</p>
                  <p>✦ Schedule messages for 7–9pm for highest open rates</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Templates */}
        {tab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Updates', 'Meetings', 'Reminders', 'Recognition', 'Support', 'Events', 'Inclusion'].map(cat => (
                <button key={cat} className="px-3 py-1 rounded-full text-[10px] font-semibold text-surface-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all">
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TEMPLATES.map((t, i) => (
                <motion.div
                  key={t.id}
                  className="glass-card p-5 hover:bg-white/[0.08] transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent-500/10 text-accent-400">{t.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-surface-400 mt-1">{t.desc}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      className="flex items-center gap-1 text-xs text-accent-400 font-semibold hover:underline"
                      onClick={() => setTemplatePreview(t)}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs text-surface-400 font-semibold hover:text-white"
                      onClick={() => applyTemplate(t)}
                    >
                      <Send className="w-3 h-3" />
                      Use
                    </button>
                  </div>
                </motion.div>
              ))}
              {/* AI Creator card */}
              <motion.div
                className="bg-white/[0.03] rounded-2xl border-2 border-dashed border-white/[0.06] p-5 flex flex-col items-center justify-center cursor-pointer hover:border-accent-500/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: TEMPLATES.length * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Sparkles className="w-8 h-8 text-accent-400 mb-2" />
                <p className="text-sm font-bold text-surface-200 text-center">AI Template Creator</p>
                <p className="text-xs text-surface-400 mt-1 text-center">Describe what you need and AI will craft a template</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Sent */}
        {tab === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-white">Sent Messages</h3>
              {SENT_MESSAGES.map((msg, i) => {
                const openPct = Math.round((msg.opens / msg.total) * 100)
                return (
                  <motion.div
                    key={msg.id}
                    className="glass-card p-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCheck className="w-3.5 h-3.5 text-success-400 flex-shrink-0" />
                          <p className="text-sm font-bold text-white truncate">{msg.subject}</p>
                        </div>
                        <p className="text-xs text-surface-400">To: {msg.to}</p>
                        <p className="text-[10px] text-surface-500 mt-0.5">{msg.time}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-success-400">{openPct}% opened</p>
                        <p className="text-[10px] text-surface-500">{msg.opens} / {msg.total}</p>
                      </div>
                    </div>
                    {/* Open rate bar */}
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg,#10b981,#6366f1)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${openPct}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Sent sidebar */}
            <div className="space-y-4">
              {/* Response Rate Trend */}
              <FadeInWhenVisible>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-success-400" />
                    <h4 className="text-sm font-bold text-white">Response Rate Trend</h4>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {RESPONSE_RATE_DATA.map((val, i) => {
                      const pct = (val / 100) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[9px] text-success-400 font-bold">{val}%</span>
                          <div className="w-full bg-white/[0.06] rounded-sm overflow-hidden flex flex-col justify-end" style={{ height: '56px' }}>
                            <motion.div
                              className="w-full rounded-sm"
                              style={{ background: 'linear-gradient(180deg,#10b981,#059669)' }}
                              initial={{ height: 0 }}
                              animate={{ height: `${pct}%` }}
                              transition={{ delay: 0.4 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-[9px] text-surface-500">{RESPONSE_RATE_LABELS[i]}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-success-400" />
                    <span className="text-[11px] text-success-300 font-semibold">+8% over 5 months</span>
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Upcoming events */}
              <FadeInWhenVisible delay={0.1}>
                <div className="glass-card p-5">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent-400" />
                    Upcoming Events
                  </h4>
                  <div className="space-y-2">
                    {[
                      { title: 'Parent-Teacher Night', date: 'Oct 15, 6pm', type: 'event' },
                      { title: 'Progress Reports Due', date: 'Oct 18', type: 'deadline' },
                      { title: 'Science Fair', date: 'Oct 25', type: 'event' },
                    ].map((event, i) => (
                      <motion.div
                        key={event.title}
                        className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.type === 'deadline' ? 'bg-warning-500/20' : 'bg-accent-500/20'}`}>
                          {event.type === 'deadline' ? <AlertTriangle className="w-4 h-4 text-warning-400" /> : <Calendar className="w-4 h-4 text-accent-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{event.title}</p>
                          <p className="text-[10px] text-surface-400">{event.date}</p>
                        </div>
                        <button className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500" title="Send reminder">
                          <Bell className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
