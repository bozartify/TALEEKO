'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, MessageSquare, Users, Bell, Send, Plus, Search,
  ChevronRight, Clock, Star, Paperclip, Check, CheckCheck,
  Phone, Video, Globe, Award, Calendar, FileText, AlertTriangle,
  Sparkles, UserPlus, Filter
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const conversations = [
  {
    id: '1', parent: 'Maria Rodriguez', student: 'Emma Rodriguez', avatar: 'MR',
    lastMessage: 'Thank you for the update on Emma\'s progress in Science!',
    time: '2h ago', unread: 0, class: '7th Science', color: '#b0623f'
  },
  {
    id: '2', parent: 'David Kim', student: 'James Kim', avatar: 'DK',
    lastMessage: 'Can we schedule a meeting about the history project?',
    time: '4h ago', unread: 2, class: '8th History', color: '#c67954'
  },
  {
    id: '3', parent: 'Fatima Patel', student: 'Sofia Patel', avatar: 'FP',
    lastMessage: 'Sofia mentioned she needs extra help with the lab report.',
    time: 'Yesterday', unread: 1, class: '7th Science', color: '#b0623f'
  },
  {
    id: '4', parent: 'John Williams', student: 'Noah Williams', avatar: 'JW',
    lastMessage: 'Is there extra credit available for the history class?',
    time: '2d ago', unread: 0, class: '8th History', color: '#c67954'
  },
  {
    id: '5', parent: 'Linda Chen', student: 'Liam Chen', avatar: 'LC',
    lastMessage: 'Thanks for sending the study guide. Very helpful!',
    time: '3d ago', unread: 0, class: '10th English', color: '#d97b63'
  },
]

const templates = [
  { name: 'Weekly Progress Report', icon: '\u{1F4CA}', desc: 'Auto-generated student progress summary' },
  { name: 'Parent-Teacher Conference', icon: '\u{1F91D}', desc: 'Meeting invitation with agenda' },
  { name: 'Assignment Reminder', icon: '⏰', desc: 'Upcoming due dates and requirements' },
  { name: 'Positive Feedback', icon: '⭐', desc: 'Celebrate student achievements' },
  { name: 'Behavior Notice', icon: '\u{1F4CB}', desc: 'Behavioral observation report' },
  { name: 'Field Trip Permission', icon: '\u{1F68C}', desc: 'Permission slip and details' },
]

const quickStats = [
  { label: 'Messages Sent', value: '47', icon: Send, color: 'bg-accent-500/20 text-accent-400', delta: 'This month' },
  { label: 'Response Rate', value: '94%', icon: CheckCheck, color: 'bg-success-500/20 text-success-400', delta: 'Above average' },
  { label: 'Active Parents', value: '89', icon: Users, color: 'bg-electric-500/20 text-electric-400', delta: 'Out of 113' },
  { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'bg-warning-500/20 text-warning-400', delta: 'Response time' },
]

const upcomingEvents = [
  { title: 'Parent-Teacher Night', date: 'Oct 15, 6pm', type: 'event' },
  { title: 'Progress Reports Due', date: 'Oct 18', type: 'deadline' },
  { title: 'Science Fair', date: 'Oct 25', type: 'event' },
]

type Tab = 'inbox' | 'compose' | 'templates'

export default function CommunicationPage() {
  const [tab, setTab] = useState<Tab>('inbox')
  const [search, setSearch] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)
  const [aiDraft, setAiDraft] = useState(false)

  const selected = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {quickStats.map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="stat-card h-full"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(139,92,246,0.12)', transition: { duration: 0.2 } }}
            >
              <div className={`icon-bubble ${s.color} mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-200 mt-0.5">{s.label}</div>
              <div className="text-xs text-surface-500 mt-1">{s.delta}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Tabs + actions */}
      <FadeUp delay={0.15}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white/[0.06] rounded-full p-1">
            {([
              { key: 'inbox' as const, label: 'Inbox', icon: Mail, count: 3 },
              { key: 'compose' as const, label: 'Compose', icon: Send },
              { key: 'templates' as const, label: 'Templates', icon: FileText },
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
                {!!t.count && (
                  <span className="bg-danger-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
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
            <div className="lg:col-span-1">
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-full transition-all"
                />
              </div>
              <div className="glass-card overflow-hidden">
                {conversations.map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    className={`w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0 ${
                      selectedConversation === conv.id ? 'bg-accent-500/10' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${conv.color},${conv.color}dd)` }}
                    >
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white truncate">{conv.parent}</p>
                        <span className="text-[10px] text-surface-500 flex-shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <p className="text-[10px] text-accent-400 font-medium">{conv.student} · {conv.class}</p>
                      <p className="text-xs text-surface-400 truncate mt-0.5">{conv.lastMessage}</p>
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

            {/* Message view */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="glass-card overflow-hidden h-full flex flex-col">
                  <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `linear-gradient(135deg,${selected.color},${selected.color}dd)` }}
                      >
                        {selected.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selected.parent}</p>
                        <p className="text-xs text-surface-400">Parent of {selected.student} · {selected.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Phone className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Video className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-4 min-h-[200px]">
                    <motion.div
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${selected.color},${selected.color}dd)` }}
                      >
                        {selected.avatar}
                      </div>
                      <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-md">
                        <p className="text-sm text-surface-200">{selected.lastMessage}</p>
                        <p className="text-[10px] text-surface-500 mt-1">{selected.time}</p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 text-sm rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                      <button className="p-2.5 rounded-full text-surface-500 hover:text-surface-200 hover:bg-white/[0.06]"><Paperclip className="w-4 h-4" /></button>
                      <motion.button
                        className="p-2.5 rounded-full text-surface-500 hover:text-accent-400 hover:bg-accent-500/10"
                        title="AI Draft"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="btn-primary p-2.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <Mail className="w-12 h-12 text-surface-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Select a conversation</h3>
                  <p className="text-sm text-surface-400">Choose a parent to view the message thread</p>
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
          >
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-white mb-4">Compose Message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">To (Parent/Guardian)</label>
                    <select className="input-base">
                      <option value="">Select a parent...</option>
                      {conversations.map(c => (
                        <option key={c.id}>{c.parent} ({c.student})</option>
                      ))}
                      <option>All parents — 7th Science</option>
                      <option>All parents — 8th History</option>
                      <option>All parents — All classes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-300 mb-1.5">Template</label>
                    <select className="input-base">
                      <option value="">No template</option>
                      {templates.map(t => (
                        <option key={t.name}>{t.icon} {t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Subject</label>
                  <input type="text" placeholder="Message subject..." className="input-base" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-surface-300">Message</label>
                    <motion.button
                      className="flex items-center gap-1 text-xs font-semibold text-accent-400 hover:text-accent-300"
                      onClick={() => setAiDraft(!aiDraft)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {aiDraft ? 'Clear AI Draft' : 'AI Draft'}
                    </motion.button>
                  </div>
                  <textarea
                    className="input-base h-48 resize-none"
                    placeholder={aiDraft ? 'AI is generating a draft based on your template and student data...' : 'Type your message...'}
                    defaultValue={aiDraft ? 'Dear Mr. & Mrs. Rodriguez,\n\nI hope this message finds you well. I wanted to share a positive update about Emma\'s progress in 7th Grade Science.\n\nEmma has been consistently demonstrating strong engagement in class, particularly during our recent unit on ecosystems. Her lab reports show excellent scientific reasoning, and she has maintained an impressive 92% average.\n\nShe has earned 3 achievement awards this semester and maintains a 15-day learning streak — a testament to her dedication.\n\nPlease don\'t hesitate to reach out if you have any questions or would like to discuss her progress further.\n\nBest regards,\nAlex Johnson\nScience Teacher, Lincoln Middle School' : ''}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Paperclip className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-500"><Globe className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs px-4 py-2">Save Draft</button>
                    <motion.button
                      className="btn-gradient text-xs"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </motion.button>
                  </div>
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
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="glass-card p-5 hover:bg-white/[0.08] transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setTab('compose')}
                >
                  <span className="text-3xl block mb-3">{t.icon}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-surface-400 mt-1">{t.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-accent-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Use template <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
              <motion.div
                className="bg-white/[0.03] rounded-2xl border-2 border-dashed border-white/[0.06] p-5 flex flex-col items-center justify-center cursor-pointer hover:border-accent-500/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: templates.length * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Sparkles className="w-8 h-8 text-accent-400 mb-2" />
                <p className="text-sm font-bold text-surface-200">AI Template Creator</p>
                <p className="text-xs text-surface-400 mt-1 text-center">Describe what you need and AI will create a template</p>
              </motion.div>
            </div>

            {/* Upcoming events sidebar */}
            <FadeInWhenVisible delay={0.2}>
              <div className="mt-6 glass-card p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  Upcoming Communication Events
                </h3>
                <div className="space-y-2">
                  {upcomingEvents.map((event, i) => (
                    <motion.div
                      key={event.title}
                      className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        event.type === 'deadline' ? 'bg-warning-500/20' : 'bg-accent-500/20'
                      }`}>
                        {event.type === 'deadline' ? (
                          <AlertTriangle className="w-4 h-4 text-warning-400" />
                        ) : (
                          <Calendar className="w-4 h-4 text-accent-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{event.title}</p>
                        <p className="text-[10px] text-surface-400">{event.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
