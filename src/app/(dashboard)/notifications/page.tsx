'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  Bell, Check, Sparkles, Info, AlertCircle, Users,
  Bot, Zap, Settings, Inbox, Mail, Clock, ChevronRight,
  X, AlertTriangle, Eye, CheckCheck, Trash2, BellOff, CheckCircle,
  MessageSquare, BookOpen, ClipboardList, Shield, Star,
  ArrowUpRight, Filter, ToggleLeft, ToggleRight,
  Activity, FileText, GraduationCap, UserCheck, AtSign
} from 'lucide-react'
import { FadeUp, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type NotificationType = 'ai' | 'system' | 'student' | 'mention' | 'activity' | 'feature'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  timestamp: number // for sorting
  read: boolean
  avatar?: string
  actionLabel?: string
  actionSecondary?: string
  grouped?: boolean
  groupCount?: number
  groupItems?: string[]
  urgent?: boolean
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'Lesson plan generated',
    description: 'Your 7th grade photosynthesis lesson plan is ready to review and assign to your class.',
    time: '2 min ago',
    timestamp: Date.now() - 120000,
    read: false,
    actionLabel: 'Review',
    actionSecondary: 'Dismiss',
  },
  {
    id: '2',
    type: 'student',
    title: '3 students submitted assignments',
    description: 'Sarah M., James T., and Aisha K. submitted their Biology Chapter 5 essays.',
    time: '8 min ago',
    timestamp: Date.now() - 480000,
    read: false,
    grouped: true,
    groupCount: 3,
    groupItems: ['Sarah M.', 'James T.', 'Aisha K.'],
    actionLabel: 'Review All',
  },
  {
    id: '3',
    type: 'mention',
    title: 'Ms. Garcia mentioned you',
    description: '@Alex can you review the updated rubric for the science fair project?',
    time: '15 min ago',
    timestamp: Date.now() - 900000,
    read: false,
    avatar: 'MG',
    actionLabel: 'Reply',
    actionSecondary: 'View Thread',
    urgent: true,
  },
  {
    id: '4',
    type: 'ai',
    title: 'Quiz generation complete',
    description: 'Your 20-question assessment on cell division has been generated with answer key and rubric.',
    time: '32 min ago',
    timestamp: Date.now() - 1920000,
    read: false,
    actionLabel: 'View Quiz',
  },
  {
    id: '5',
    type: 'activity',
    title: 'Student milestone reached',
    description: 'Sarah M. completed all assignments in the Biology unit 2 weeks ahead of schedule.',
    time: '1 hour ago',
    timestamp: Date.now() - 3600000,
    read: false,
    avatar: 'SM',
    actionLabel: 'Send Kudos',
  },
  {
    id: '6',
    type: 'system',
    title: 'Agent Swarm update available',
    description: 'Version 2.4 brings collaborative planning, improved rubric generation, and faster grading.',
    time: '2 hours ago',
    timestamp: Date.now() - 7200000,
    read: false,
    actionLabel: 'Update Now',
    actionSecondary: 'Later',
  },
  {
    id: '7',
    type: 'ai',
    title: 'Curriculum alignment complete',
    description: 'Your Biology curriculum has been mapped to NGSS standards. 94% alignment achieved.',
    time: '3 hours ago',
    timestamp: Date.now() - 10800000,
    read: false,
    actionLabel: 'View Report',
  },
  {
    id: '8',
    type: 'student',
    title: '5 students need attention',
    description: 'Performance alerts for Period 3: Marcus L., Diana R., Tyler S., Jenny W., and Leo P.',
    time: '4 hours ago',
    timestamp: Date.now() - 14400000,
    read: false,
    grouped: true,
    groupCount: 5,
    groupItems: ['Marcus L.', 'Diana R.', 'Tyler S.', 'Jenny W.', 'Leo P.'],
    actionLabel: 'View Details',
    urgent: true,
  },
  {
    id: '9',
    type: 'mention',
    title: 'Principal Davis tagged you',
    description: 'Great job on the science fair preparation! @Alex your students were outstanding.',
    time: '5 hours ago',
    timestamp: Date.now() - 18000000,
    read: true,
    avatar: 'PD',
  },
  {
    id: '10',
    type: 'feature',
    title: 'New: AI Writing Coach',
    description: 'Help students improve their writing with real-time AI feedback and suggestions.',
    time: '6 hours ago',
    timestamp: Date.now() - 21600000,
    read: true,
    actionLabel: 'Try It',
  },
  {
    id: '11',
    type: 'ai',
    title: 'Grading batch complete',
    description: '28 essays graded for Period 2 History class. Average score: 82%. Review flagged items.',
    time: 'Yesterday',
    timestamp: Date.now() - 86400000,
    read: true,
    actionLabel: 'Review Grades',
  },
  {
    id: '12',
    type: 'system',
    title: 'Storage usage at 75%',
    description: 'You are using 7.5 GB of 10 GB. Consider archiving older materials to free up space.',
    time: 'Yesterday',
    timestamp: Date.now() - 90000000,
    read: true,
    actionLabel: 'Manage',
  },
  {
    id: '13',
    type: 'student',
    title: 'Class average improved',
    description: 'Period 3 Biology class average went up 8% this week. Top improver: Marcus L. (+15%).',
    time: 'Yesterday',
    timestamp: Date.now() - 100000000,
    read: true,
    avatar: 'P3',
  },
  {
    id: '14',
    type: 'activity',
    title: 'Parent-teacher conference reminder',
    description: 'You have 6 conferences scheduled for next Tuesday. Prep materials are ready.',
    time: '2 days ago',
    timestamp: Date.now() - 172800000,
    read: true,
    actionLabel: 'View Schedule',
  },
  {
    id: '15',
    type: 'ai',
    title: 'Worksheet pack ready',
    description: 'Differentiated worksheet pack for Quadratic Equations (3 levels) is ready to download.',
    time: '2 days ago',
    timestamp: Date.now() - 180000000,
    read: true,
    actionLabel: 'Download',
  },
  {
    id: '16',
    type: 'feature',
    title: 'Rubric builder updated',
    description: 'New templates and AI-assisted criteria suggestions with standards alignment are now available.',
    time: '3 days ago',
    timestamp: Date.now() - 259200000,
    read: true,
  },
  {
    id: '17',
    type: 'system',
    title: 'Weekly digest ready',
    description: 'Your weekly performance summary: 12 lessons created, 142 students reached, 31 hours saved.',
    time: '3 days ago',
    timestamp: Date.now() - 270000000,
    read: true,
    actionLabel: 'View Report',
  },
]

const tabs = [
  { id: 'all', label: 'All', icon: Inbox },
  { id: 'unread', label: 'Unread', icon: Bell },
  { id: 'ai', label: 'AI Activity', icon: Bot },
  { id: 'student', label: 'Student Updates', icon: GraduationCap },
  { id: 'system', label: 'System', icon: Settings },
  { id: 'mention', label: 'Mentions', icon: AtSign },
]

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string; gradient: string }> = {
  ai:       { icon: Bot,            color: 'text-accent-400',   bg: 'bg-accent-400/15',   gradient: 'from-accent-500/20 to-accent-600/5' },
  system:   { icon: Settings,       color: 'text-amber-400',    bg: 'bg-amber-400/15',     gradient: 'from-amber-400/20 to-amber-500/5' },
  student:  { icon: GraduationCap,  color: 'text-neon-400',     bg: 'bg-neon-400/15',      gradient: 'from-neon-400/20 to-neon-500/5' },
  mention:  { icon: AtSign,         color: 'text-electric-400', bg: 'bg-electric-400/15',  gradient: 'from-electric-400/20 to-electric-500/5' },
  activity: { icon: Activity,       color: 'text-success-400',  bg: 'bg-success-400/15',   gradient: 'from-success-400/20 to-success-500/5' },
  feature:  { icon: Zap,            color: 'text-warning-400',  bg: 'bg-warning-400/15',   gradient: 'from-warning-400/20 to-warning-500/5' },
}

const timelineEvents = [
  { id: 't1', title: 'Lesson plan reviewed & published',      time: '9:42 AM',    icon: BookOpen,      color: 'text-accent-400',   bg: 'bg-accent-400/15' },
  { id: 't2', title: 'AI graded 28 essays in Period 2',       time: '9:15 AM',    icon: Bot,           color: 'text-accent-400',   bg: 'bg-accent-400/15' },
  { id: 't3', title: 'Sarah M. achieved biology milestone',   time: '8:50 AM',    icon: Star,          color: 'text-warning-400',  bg: 'bg-warning-400/15' },
  { id: 't4', title: 'Quiz assigned to Period 3',             time: '8:30 AM',    icon: ClipboardList, color: 'text-success-400',  bg: 'bg-success-400/15' },
  { id: 't5', title: 'Curriculum aligned to NGSS standards',  time: '8:00 AM',    icon: Shield,        color: 'text-electric-400', bg: 'bg-electric-400/15' },
  { id: 't6', title: 'Agent Swarm completed planning task',   time: 'Yesterday',  icon: Zap,           color: 'text-warning-400',  bg: 'bg-warning-400/15' },
  { id: 't7', title: 'Parent conference materials prepared',  time: 'Yesterday',  icon: FileText,      color: 'text-neon-400',     bg: 'bg-neon-400/15' },
  { id: 't8', title: 'Weekly performance digest generated',   time: '2 days ago', icon: Activity,      color: 'text-accent-400',   bg: 'bg-accent-400/15' },
]

const prefCategories = [
  { id: 'ai',       label: 'AI Activity',      icon: Bot },
  { id: 'students', label: 'Student Updates',   icon: GraduationCap },
  { id: 'system',   label: 'System Alerts',     icon: Settings },
  { id: 'mentions', label: 'Mentions',          icon: AtSign },
]

// ---------------------------------------------------------------------------
// Swipeable notification row
// ---------------------------------------------------------------------------
function SwipeableNotification({
  notification,
  config,
  index,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification
  config: (typeof typeConfig)[NotificationType]
  index: number
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const x = useMotionValue(0)
  const bg = useTransform(x, [-120, -60, 0], ['rgba(239,68,68,0.25)', 'rgba(239,68,68,0.1)', 'rgba(0,0,0,0)'])
  const dismissOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])

  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, transition: { duration: 0.3 } }}
      transition={{ delay: index * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Swipe background hint */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center justify-end pr-6 pointer-events-none"
        style={{ backgroundColor: bg }}
      >
        <motion.div style={{ opacity: dismissOpacity }} className="flex items-center gap-2 text-red-400 text-xs font-semibold">
          <Trash2 className="w-4 h-4" /> Dismiss
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onDismiss(notification.id)
        }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        whileTap={{ scale: 0.995 }}
        onClick={() => { if (!notification.read) onMarkRead(notification.id) }}
        className={`glass-card p-4 md:p-5 flex items-start gap-4 group cursor-pointer transition-all relative ${
          !notification.read
            ? 'border-l-2 border-l-accent-500 shadow-[inset_0_0_30px_rgba(99,102,241,0.04)]'
            : 'opacity-80 hover:opacity-100'
        } ${notification.urgent ? 'ring-1 ring-danger-400/20' : ''}`}
      >
        {/* Avatar / Icon */}
        <div className="relative flex-shrink-0">
          {notification.avatar ? (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${config.bg} ${config.color}`}>
              {notification.avatar}
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${config.gradient}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
          )}
          {!notification.read && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-400 ring-2 ring-[#0a0a1a]" />
          )}
          {notification.urgent && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-danger-400/20 flex items-center justify-center">
              <AlertTriangle className="w-2.5 h-2.5 text-danger-400" />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-white' : 'text-surface-300'}`}>
                  {notification.title}
                </p>
                {notification.grouped && (
                  <span className="flex-shrink-0 text-[10px] font-bold bg-accent-500/15 text-accent-300 px-1.5 py-0.5 rounded-md">
                    {notification.groupCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-surface-400 mt-1 line-clamp-2">{notification.description}</p>

              {/* Grouped sub-items */}
              {notification.grouped && notification.groupItems && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {notification.groupItems.map((item) => (
                    <span key={item} className="text-[10px] font-medium bg-white/[0.06] text-surface-300 px-2 py-0.5 rounded-md border border-white/[0.06]">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              {(notification.actionLabel || notification.actionSecondary) && (
                <div className="flex items-center gap-2 mt-3">
                  {notification.actionLabel && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="btn-primary text-[11px] px-3 py-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.actionLabel}
                    </motion.button>
                  )}
                  {notification.actionSecondary && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="btn-secondary text-[11px] px-3 py-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.actionSecondary}
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Time + quick actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-[11px] text-surface-500 whitespace-nowrap">{notification.time}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }}
                    className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3 text-surface-400" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onDismiss(notification.id) }}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3 h-3 text-surface-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Toggle switch component
// ---------------------------------------------------------------------------
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-accent-500' : 'bg-white/[0.1]'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState('all')
  const [showPrefs, setShowPrefs] = useState(false)

  // Preference toggles state
  const [prefs, setPrefs] = useState<Record<string, { email: boolean; push: boolean; inApp: boolean }>>({
    ai:       { email: true,  push: true,  inApp: true },
    students: { email: true,  push: true,  inApp: true },
    system:   { email: false, push: true,  inApp: true },
    mentions: { email: true,  push: true,  inApp: true },
  })

  const togglePref = useCallback((category: string, channel: 'email' | 'push' | 'inApp') => {
    setPrefs(prev => ({
      ...prev,
      [category]: { ...prev[category], [channel]: !prev[category][channel] },
    }))
  }, [])

  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setItems(prev => prev.filter(n => !n.read))
  }, [])

  const markRead = useCallback((id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setItems(prev => prev.filter(n => n.id !== id))
  }, [])

  // Computed
  const unreadCount = items.filter(n => !n.read).length
  const urgentCount = items.filter(n => n.urgent && !n.read).length
  const aiCount = items.filter(n => n.type === 'ai' && !n.read).length
  const thisWeekCount = items.length

  const filtered = items.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    return n.type === activeTab
  })

  const stats = [
    { label: 'Unread',          value: String(unreadCount),    icon: Bell,          gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400', accent: unreadCount > 0 },
    { label: 'Action Required', value: String(urgentCount),    icon: AlertTriangle, gradient: 'from-danger-400/20 to-danger-500/5',  iconColor: 'text-danger-400',  accent: urgentCount > 0 },
    { label: 'AI Updates',      value: String(aiCount),        icon: Bot,           gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400', accent: false },
    { label: 'This Week',       value: String(thisWeekCount),  icon: Clock,         gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400', accent: false },
  ]

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
            <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <span className="text-sm font-medium text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Bell className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">Notification Center</h1>
                  <span className="text-xs font-bold bg-violet-500/20 text-violet-300 px-2.5 py-0.5 rounded-full">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400 mt-1">Stay on top of your teaching activity and AI updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <motion.button
                onClick={() => setShowPrefs(!showPrefs)}
                className="btn-secondary text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Settings className="w-3.5 h-3.5" /> Preferences
              </motion.button>
              <motion.button
                onClick={() => { markAllRead(); showToast('All notifications marked as read!') }}
                className="btn-secondary text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
              </motion.button>
              <motion.button
                onClick={() => { clearAll(); showToast('Read notifications cleared!') }}
                className="btn-secondary text-xs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Read
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Unread</span>
              <span className="text-xs font-bold text-violet-400">{unreadCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Urgent</span>
              <span className="text-xs font-bold text-danger-400">{urgentCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">AI Updates</span>
              <span className="text-xs font-bold text-electric-400">{aiCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">This Week</span>
              <span className="text-xs font-bold text-white">{thisWeekCount}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Filter</span>
              <span className="text-xs font-bold text-success-400 capitalize">{activeTab}</span>
            </div>
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
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.gradient}`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                {s.accent && (
                  <span className="flex items-center gap-0.5 text-xs font-bold text-danger-400">
                    <ArrowUpRight className="w-3 h-3" />
                    Needs attention
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Notification Preferences Panel */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-accent-400" />
                  Quick Preferences
                </h3>
                <motion.button
                  onClick={() => setShowPrefs(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-surface-400" />
                </motion.button>
              </div>

              {/* Headers */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 gap-y-3 items-center">
                <div />
                <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider text-center w-12">Email</span>
                <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider text-center w-12">Push</span>
                <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider text-center w-12">In-App</span>

                {prefCategories.map((cat) => (
                  <>
                    <div key={`label-${cat.id}`} className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4 text-surface-400" />
                      <span className="text-xs font-semibold text-surface-200">{cat.label}</span>
                    </div>
                    <div key={`email-${cat.id}`} className="flex justify-center">
                      <Toggle enabled={prefs[cat.id].email} onToggle={() => togglePref(cat.id, 'email')} />
                    </div>
                    <div key={`push-${cat.id}`} className="flex justify-center">
                      <Toggle enabled={prefs[cat.id].push} onToggle={() => togglePref(cat.id, 'push')} />
                    </div>
                    <div key={`inapp-${cat.id}`} className="flex justify-center">
                      <Toggle enabled={prefs[cat.id].inApp} onToggle={() => togglePref(cat.id, 'inApp')} />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <FadeUp delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const count = tab.id === 'all'
              ? items.length
              : tab.id === 'unread'
                ? unreadCount
                : items.filter(n => n.type === tab.id).length
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                    : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:text-surface-200 hover:bg-white/[0.06]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.id
                    ? 'bg-accent-500/20 text-accent-300'
                    : 'bg-white/[0.06] text-surface-500'
                }`}>
                  {count}
                </span>
              </motion.button>
            )
          })}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main notification list */}
        <div className="lg:col-span-2 space-y-3">
          {/* Batch action bar */}
          <FadeUp delay={0.12}>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-surface-500">
                {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
                {activeTab !== 'all' && <span className="text-surface-600"> in {tabs.find(t => t.id === activeTab)?.label}</span>}
              </p>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-surface-400 hover:text-accent-300 transition-colors"
                >
                  <Eye className="w-3 h-3" /> Mark visible read
                </motion.button>
                <span className="text-surface-600">|</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-[11px] font-medium text-surface-400 hover:text-warning-300 transition-colors"
                >
                  <BellOff className="w-3 h-3" /> Snooze 1h
                </motion.button>
              </div>
            </div>
          </FadeUp>

          {/* Notifications */}
          <AnimatePresence mode="popLayout">
            {filtered.map((notification, i) => {
              const config = typeConfig[notification.type]
              return (
                <SwipeableNotification
                  key={notification.id}
                  notification={notification}
                  config={config}
                  index={i}
                  onMarkRead={markRead}
                  onDismiss={dismissNotification}
                />
              )
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <Inbox className="w-14 h-14 text-surface-600 mx-auto mb-4" />
              </motion.div>
              <p className="text-sm font-semibold text-surface-300 mb-1">All caught up!</p>
              <p className="text-xs text-surface-500">No notifications in this category. Check back later for updates.</p>
            </motion.div>
          )}
        </div>

        {/* Right sidebar: Activity Timeline */}
        <div className="space-y-6">
          <FadeUp delay={0.2}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-accent-400" /> Recent Activity
                </h3>
                <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Timeline</span>
              </div>

              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-accent-500/30 via-white/[0.08] to-transparent" />

                <div className="space-y-0">
                  {timelineEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      className="relative flex items-start gap-3 py-3 group"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.35 }}
                    >
                      {/* Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center ${event.bg} border border-white/[0.06]`}
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.15 }}
                        >
                          <event.icon className={`w-3.5 h-3.5 ${event.color}`} />
                        </motion.div>
                        {i === 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 pt-1">
                        <p className="text-xs font-semibold text-surface-200 group-hover:text-white transition-colors leading-snug">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-surface-500 mt-0.5">{event.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors py-2 rounded-xl hover:bg-white/[0.03]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                View Full Activity Log <ChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
          </FadeUp>

          {/* Quick Stats Sidebar Card */}
          <FadeUp delay={0.3}>
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.04] via-transparent to-neon-400/[0.03] pointer-events-none" />
              <div className="relative">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-400" /> Notification Insights
                </h3>
                {(() => {
                  const items = [
                    { label: 'Response rate', value: '94%', color: '#10b981', bar: 94 },
                    { label: 'Avg. response time', value: '12m', color: '#6366f1', bar: 72 },
                    { label: 'Resolved this week', value: '18', color: '#a78bfa', bar: 85 },
                  ]
                  const W = 280, CW = 34, GAP = 8, ROW = 28
                  const BAR_MAX = W - CW - 4
                  const H = items.length * (ROW + GAP) - GAP
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
                      <defs>
                        {items.map((item, i) => (
                          <linearGradient key={i} id={`ntf-ins-${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={item.color} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      {items.map((item, i) => {
                        const bw = (item.bar / 100) * BAR_MAX
                        const y = i * (ROW + GAP)
                        return (
                          <g key={item.label}>
                            <text x={0} y={y + 12} fill="rgba(255,255,255,0.45)" fontSize={10} fontFamily="inherit">{item.label}</text>
                            <text x={BAR_MAX + 6} y={y + 12} fill={item.color} fontSize={10} fontFamily="inherit" fontWeight="bold">{item.value}</text>
                            <rect x={0} y={y + 16} width={BAR_MAX} height={9} rx={4} fill="rgba(255,255,255,0.05)" />
                            <motion.rect x={0} y={y + 16} height={9} rx={4} fill={`url(#ntf-ins-${i})`}
                              initial={{ width: 0 }} animate={{ width: bw }}
                              transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                            />
                          </g>
                        )
                      })}
                    </svg>
                  )
                })()}
              </div>
            </div>
          </FadeUp>

          {/* Mute / DND card */}
          <FadeUp delay={0.35}>
            <div className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning-400/15 flex items-center justify-center">
                  <BellOff className="w-4 h-4 text-warning-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-surface-200">Do Not Disturb</p>
                  <p className="text-[10px] text-surface-500 mt-0.5">Mute all push notifications</p>
                </div>
                <Toggle enabled={false} onToggle={() => {}} />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
