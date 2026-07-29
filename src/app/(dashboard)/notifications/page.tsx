'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Check, Sparkles, Info, AlertCircle, Users,
  Bot, Zap, Settings, Inbox
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

type NotificationType = 'ai' | 'system' | 'feature' | 'activity'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'Lesson plan generated',
    description: 'Your 7th grade photosynthesis lesson plan is ready to review.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'feature',
    title: 'New feature: Agent Swarms',
    description: 'Deploy multiple AI agents to collaborate on complex curriculum tasks.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'System maintenance complete',
    description: 'All services have been updated. Performance improvements are now live.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'activity',
    title: 'Student milestone reached',
    description: 'Sarah M. completed all assignments in the Biology unit ahead of schedule.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '5',
    type: 'ai',
    title: 'Quiz generation complete',
    description: 'Your 20-question assessment on cell division has been generated.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Storage usage at 75%',
    description: 'Consider archiving older materials to free up space.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '7',
    type: 'feature',
    title: 'Rubric builder updated',
    description: 'New templates and AI-assisted criteria suggestions are now available.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '8',
    type: 'activity',
    title: 'Class average improved',
    description: 'Period 3 Biology class average went up 8% this week.',
    time: '3 days ago',
    read: true,
  },
]

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'ai', label: 'AI Updates' },
  { id: 'system', label: 'System' },
]

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  ai: { icon: Bot, color: 'text-accent-400', bg: 'bg-accent-400/15' },
  system: { icon: Settings, color: 'text-amber-400', bg: 'bg-amber-400/15' },
  feature: { icon: Zap, color: 'text-electric-400', bg: 'bg-electric-400/15' },
  activity: { icon: Users, color: 'text-neon-400', bg: 'bg-neon-400/15' },
}

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications)
  const [activeTab, setActiveTab] = useState('all')

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filtered = items.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'ai') return n.type === 'ai'
    if (activeTab === 'system') return n.type === 'system'
    return true
  })

  return (
    <div className="max-w-3xl space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-accent-400" />
            <h1 className="text-2xl font-black text-white">Notifications</h1>
            {items.filter(n => !n.read).length > 0 && (
              <span className="text-xs font-bold bg-accent-500/20 text-accent-300 px-2 py-0.5 rounded-full">
                {items.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          <motion.button
            onClick={markAllRead}
            className="btn-secondary text-xs"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </motion.button>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40'
                  : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:text-surface-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((notification, i) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={`glass-card p-4 flex items-start gap-4 group hover:bg-white/[0.04] transition-colors cursor-pointer ${
                  !notification.read ? 'border-l-2 border-l-accent-500' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{notification.title}</p>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">{notification.description}</p>
                  <p className="text-[11px] text-surface-500 mt-1.5">{notification.time}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <Inbox className="w-12 h-12 text-surface-600 mx-auto mb-4" />
            <p className="text-sm font-semibold text-surface-300 mb-1">No notifications</p>
            <p className="text-xs text-surface-500">You're all caught up! Check back later for updates.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
