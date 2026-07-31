'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Sparkles, Edit3, UserPlus, Shuffle, ChevronDown,
  Target, BookOpen, Star, Zap, Brain, TrendingUp, MessageSquare,
  CheckCircle, BarChart2, ArrowRight, Layers, Clock, Filter,
  Trophy, AlertTriangle, ChevronRight
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

type GroupType = 'Lab' | 'Reading' | 'Support' | 'Project' | 'Discussion'

interface Group {
  id: string
  name: string
  color: string
  type: GroupType
  students: Student[]
  purpose: string
  lastActive: string
  nextMeeting?: string
  avgPerformance: number
  trend: 'up' | 'down' | 'stable'
  completedTasks: number
  totalTasks: number
}

interface Student {
  name: string
  initials: string
  avg: number
  status: 'excelling' | 'on-track' | 'at-risk'
}

const groups: Group[] = [
  {
    id: '1',
    name: 'Lab Partners A',
    color: '#6366f1',
    type: 'Lab',
    purpose: 'Photosynthesis lab investigations — collaborative data collection',
    lastActive: '2 hours ago',
    nextMeeting: 'Today 2:00 PM',
    avgPerformance: 88,
    trend: 'up',
    completedTasks: 4,
    totalTasks: 5,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
      { name: 'Ava Patel', initials: 'AP', avg: 91, status: 'excelling' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
    ],
  },
  {
    id: '2',
    name: 'Reading Circle — Advanced',
    color: '#10b981',
    type: 'Reading',
    purpose: 'Advanced comprehension and literary analysis',
    lastActive: 'Yesterday',
    nextMeeting: 'Thu 1:30 PM',
    avgPerformance: 92,
    trend: 'up',
    completedTasks: 6,
    totalTasks: 6,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Sofia Rodriguez', initials: 'SR', avg: 96, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
    ],
  },
  {
    id: '3',
    name: 'Math Support Group',
    color: '#f97316',
    type: 'Support',
    purpose: 'Extra practice with algebraic concepts and problem-solving',
    lastActive: '3 days ago',
    nextMeeting: 'Tomorrow 3:15 PM',
    avgPerformance: 63,
    trend: 'up',
    completedTasks: 2,
    totalTasks: 6,
    students: [
      { name: 'Noah Williams', initials: 'NW', avg: 68, status: 'at-risk' },
      { name: 'Mia Thompson', initials: 'MT', avg: 59, status: 'at-risk' },
      { name: 'Ava Patel', initials: 'AP', avg: 63, status: 'at-risk' },
    ],
  },
  {
    id: '4',
    name: 'History Debate Team',
    color: '#ec4899',
    type: 'Discussion',
    purpose: 'American Revolution debate preparation and argumentation',
    lastActive: '1 day ago',
    nextMeeting: 'Fri 11:00 AM',
    avgPerformance: 84,
    trend: 'stable',
    completedTasks: 3,
    totalTasks: 4,
    students: [
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
      { name: 'Sofia Rodriguez', initials: 'SR', avg: 96, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
    ],
  },
  {
    id: '5',
    name: 'ELL Support Circle',
    color: '#22d3ee',
    type: 'Support',
    purpose: 'Language scaffolding, vocabulary building, and comprehension',
    lastActive: 'Today',
    nextMeeting: 'Today 12:30 PM',
    avgPerformance: 71,
    trend: 'up',
    completedTasks: 3,
    totalTasks: 5,
    students: [
      { name: 'Noah Williams', initials: 'NW', avg: 68, status: 'at-risk' },
      { name: 'Mia Thompson', initials: 'MT', avg: 74, status: 'on-track' },
    ],
  },
  {
    id: '6',
    name: 'Science Fair Team',
    color: '#8b5cf6',
    type: 'Project',
    purpose: 'Ecosystem impact research project for district science fair',
    lastActive: '4 hours ago',
    nextMeeting: 'Wed 3:00 PM',
    avgPerformance: 89,
    trend: 'up',
    completedTasks: 5,
    totalTasks: 8,
    students: [
      { name: 'Emma Davis', initials: 'ED', avg: 94, status: 'excelling' },
      { name: 'Ava Patel', initials: 'AP', avg: 91, status: 'excelling' },
      { name: 'Ethan Kim', initials: 'EK', avg: 88, status: 'on-track' },
      { name: 'James Brown', initials: 'JB', avg: 79, status: 'on-track' },
      { name: 'Liam Chen', initials: 'LC', avg: 87, status: 'on-track' },
    ],
  },
]

const typeConfig: Record<GroupType, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  Lab:        { label: 'Lab',        bg: 'bg-accent-500/15',   text: 'text-accent-400',  icon: Zap },
  Reading:    { label: 'Reading',    bg: 'bg-success-400/15',  text: 'text-success-400', icon: BookOpen },
  Support:    { label: 'Support',    bg: 'bg-warning-400/15',  text: 'text-warning-400', icon: Target },
  Project:    { label: 'Project',    bg: 'bg-neon-400/15',     text: 'text-neon-400',    icon: Star },
  Discussion: { label: 'Discussion', bg: 'bg-electric-400/15', text: 'text-electric-400',icon: MessageSquare },
}

const statusConfig = {
  excelling:  { bg: 'bg-success-400/15',  text: 'text-success-400',  label: 'Excelling' },
  'on-track': { bg: 'bg-accent-400/15',   text: 'text-accent-400',   label: 'On Track' },
  'at-risk':  { bg: 'bg-danger-400/15',   text: 'text-danger-400',   label: 'At Risk' },
}

const aiInsights = [
  {
    color: '#f59e0b',
    icon: AlertTriangle,
    title: 'Math Support Group needs attention',
    desc: '3 students missed last 2 sessions. Consider individual check-ins before next meeting.',
    action: 'View Group',
  },
  {
    color: '#10b981',
    icon: TrendingUp,
    title: 'Science Fair Team trending up',
    desc: 'Average performance increased +7 points this month. Group synergy is strong.',
    action: 'See Progress',
  },
  {
    color: '#6366f1',
    icon: Brain,
    title: 'Optimal regrouping suggestion',
    desc: 'Based on recent assessment data, Emma and Noah pairing could boost Noah\'s engagement.',
    action: 'Review Suggestion',
  },
]

export default function GroupsPage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('1')
  const [filter, setFilter] = useState<'all' | GroupType>('all')

  const filtered = filter === 'all' ? groups : groups.filter(g => g.type === filter)
  const totalStudents = new Set(groups.flatMap(g => g.students.map(s => s.name))).size
  const atRiskGroups = groups.filter(g => g.avgPerformance < 70).length
  const activeToday = groups.filter(g => g.lastActive === 'Today' || g.lastActive === '2 hours ago' || g.lastActive === '4 hours ago').length

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Users className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Student Groups</h2>
              <p className="text-xs text-surface-400">{groups.length} groups · {totalStudents} unique students</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" />
              AI Smart Group
            </motion.button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Shuffle className="w-3.5 h-3.5" />
              Random
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Group
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.04}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Groups', value: groups.length, icon: Layers, color: '#6366f1', sub: 'Across all classes' },
            { label: 'Active Today', value: activeToday, icon: CheckCircle, color: '#10b981', sub: 'Meeting or working' },
            { label: 'Need Attention', value: atRiskGroups, icon: AlertTriangle, color: '#f97316', sub: 'Below 70% avg' },
            { label: 'Avg Performance', value: `${Math.round(groups.reduce((a, g) => a + g.avgPerformance, 0) / groups.length)}%`, icon: BarChart2, color: '#8b5cf6', sub: 'Across all groups' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '18' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-surface-400">{stat.label}</span>
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* AI Insights */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8b5cf618' }}>
              <Brain className="w-3.5 h-3.5 text-neon-400" />
            </div>
            <span className="text-sm font-bold text-white">AI Group Insights</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-neon-400/15 text-neon-400 font-medium">3 insights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, i) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all group cursor-pointer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileHover={{ y: -1 }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: insight.color + '20' }}>
                    <Icon className="w-4 h-4" style={{ color: insight.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight mb-1">{insight.title}</p>
                    <p className="text-[11px] text-surface-400 leading-relaxed">{insight.desc}</p>
                    <button className="mt-2 text-[11px] font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: insight.color }}>
                      {insight.action}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </FadeUp>

      {/* Filter */}
      <FadeUp delay={0.1}>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'Lab', 'Reading', 'Support', 'Project', 'Discussion'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              {f === 'all' ? 'All Groups' : f}
            </button>
          ))}
          <div className="ml-auto">
            <button className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Sort
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((group, i) => {
          const isExpanded = expandedGroup === group.id
          const typeStyle = typeConfig[group.type]
          const TypeIcon = typeStyle.icon
          const progressPct = Math.round((group.completedTasks / group.totalTasks) * 100)

          return (
            <motion.div
              key={group.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05 }}
            >
              <div className="h-0.5" style={{ backgroundColor: group.color }} />
              <button
                className="w-full p-5 text-left"
                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{group.name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${typeStyle.bg} ${typeStyle.text}`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        {typeStyle.label}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5 leading-relaxed truncate">{group.purpose}</p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="flex-shrink-0 mt-0.5">
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                  </motion.div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-1.5">
                    {group.students.slice(0, 5).map((s, si) => (
                      <div
                        key={s.name}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-surface-900"
                        style={{
                          background: `linear-gradient(135deg, ${group.color}, ${group.color}99)`,
                          zIndex: 5 - si,
                        }}
                        title={s.name}
                      >
                        {s.initials}
                      </div>
                    ))}
                    {group.students.length > 5 && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-surface-400 text-[8px] font-bold bg-white/[0.06] ring-2 ring-surface-900">
                        +{group.students.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-surface-500">{group.students.length} members</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3 text-surface-600" />
                    <span className="text-[11px] text-surface-500">{group.lastActive}</span>
                  </div>
                </div>

                {/* Progress + Avg */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-surface-500">Tasks {group.completedTasks}/{group.totalTasks}</span>
                      <span className="text-[10px] font-semibold" style={{ color: group.color }}>{progressPct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: group.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] flex-shrink-0">
                    <span className="text-xs font-black text-white">{group.avgPerformance}%</span>
                    <span className="text-[10px] text-surface-500">avg</span>
                    {group.trend === 'up' && <TrendingUp className="w-3 h-3 text-success-400 ml-0.5" />}
                    {group.trend === 'down' && <TrendingUp className="w-3 h-3 text-danger-400 ml-0.5 rotate-180" />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/[0.05]">
                      <div className="pt-4 space-y-2">
                        {group.students.map((student, si) => {
                          const st = statusConfig[student.status]
                          return (
                            <motion.div
                              key={student.name}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.04 }}
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}99)` }}
                              >
                                {student.initials}
                              </div>
                              <span className="text-sm text-white flex-1">{student.name}</span>
                              <span className="text-xs font-bold text-white">{student.avg}%</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                            </motion.div>
                          )
                        })}
                      </div>

                      {group.nextMeeting && (
                        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <Clock className="w-3.5 h-3.5 text-surface-500" />
                          <span className="text-xs text-surface-400">Next: </span>
                          <span className="text-xs font-semibold text-white">{group.nextMeeting}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                        <button className="btn-secondary text-xs px-3 py-1.5">
                          <UserPlus className="w-3 h-3" />
                          Add Student
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5">
                          <Edit3 className="w-3 h-3" />
                          Edit Group
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5">
                          <MessageSquare className="w-3 h-3" />
                          Message
                        </button>
                        <button className="btn-secondary text-xs px-3 py-1.5 ml-auto">
                          <BarChart2 className="w-3 h-3" />
                          Analytics
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Panels */}
      <FadeInWhenVisible delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Performing Groups */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-warning-400/15">
                <Trophy className="w-3.5 h-3.5 text-warning-400" />
              </div>
              <span className="text-sm font-bold text-white">Top Groups</span>
            </div>
            <div className="space-y-2.5">
              {[...groups].sort((a, b) => b.avgPerformance - a.avgPerformance).slice(0, 4).map((g, i) => (
                <div key={g.id} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-surface-600 w-4">#{i + 1}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: g.color + '25' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  </div>
                  <span className="text-xs text-surface-300 flex-1 truncate">{g.name}</span>
                  <span className="text-xs font-bold text-white">{g.avgPerformance}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type Distribution */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-500/15">
                <Layers className="w-3.5 h-3.5 text-accent-400" />
              </div>
              <span className="text-sm font-bold text-white">Group Types</span>
            </div>
            <div className="space-y-2.5">
              {(['Lab', 'Reading', 'Support', 'Project', 'Discussion'] as GroupType[]).map(type => {
                const count = groups.filter(g => g.type === type).length
                const pct = Math.round((count / groups.length) * 100)
                const { text, bg } = typeConfig[type]
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${text}`}>{type}</span>
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${bg.replace('/15', '/60')}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-neon-400/15">
                <Zap className="w-3.5 h-3.5 text-neon-400" />
              </div>
              <span className="text-sm font-bold text-white">Quick Actions</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Auto-balance by performance', icon: BarChart2, color: '#6366f1' },
                { label: 'Create activity for all groups', icon: BookOpen, color: '#10b981' },
                { label: 'Send group progress report', icon: TrendingUp, color: '#f97316' },
                { label: 'Shuffle all groups randomly', icon: Shuffle, color: '#8b5cf6' },
                { label: 'Export group roster (CSV)', icon: Star, color: '#22d3ee' },
              ].map(action => (
                <motion.button
                  key={action.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-surface-300 hover:text-white hover:bg-white/[0.04] transition-all"
                  whileHover={{ x: 2 }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: action.color + '15' }}>
                    <action.icon className="w-3 h-3" style={{ color: action.color }} />
                  </div>
                  {action.label}
                  <ChevronRight className="w-3 h-3 ml-auto text-surface-600" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
