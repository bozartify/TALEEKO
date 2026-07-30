'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Sparkles, Edit3, Trash2, UserPlus, Shuffle,
  ChevronDown, Target, BookOpen, Star, Zap
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const groups = [
  {
    id: '1', name: 'Lab Partners A', color: '#6366f1', type: 'Lab' as const,
    students: ['Emma Davis', 'Liam Chen', 'Ava Patel', 'James Brown'],
    purpose: 'Photosynthesis lab investigations',
  },
  {
    id: '2', name: 'Reading Circle - Advanced', color: '#10b981', type: 'Reading' as const,
    students: ['Emma Davis', 'Sofia Rodriguez', 'Ethan Kim'],
    purpose: 'Advanced comprehension and analysis',
  },
  {
    id: '3', name: 'Math Support Group', color: '#f97316', type: 'Support' as const,
    students: ['Noah Williams', 'Mia Thompson', 'Ava Patel'],
    purpose: 'Extra practice with algebraic concepts',
  },
  {
    id: '4', name: 'History Debate Team', color: '#ec4899', type: 'Project' as const,
    students: ['Liam Chen', 'James Brown', 'Sofia Rodriguez', 'Ethan Kim'],
    purpose: 'American Revolution debate preparation',
  },
  {
    id: '5', name: 'ELL Support Circle', color: '#22d3ee', type: 'Support' as const,
    students: ['Noah Williams', 'Mia Thompson'],
    purpose: 'Language scaffolding and vocabulary building',
  },
  {
    id: '6', name: 'Science Fair Team', color: '#8b5cf6', type: 'Project' as const,
    students: ['Emma Davis', 'Ava Patel', 'Ethan Kim', 'James Brown', 'Liam Chen'],
    purpose: 'Ecosystem impact research project',
  },
]

const groupTypeColors = {
  Lab: { bg: 'bg-accent-500/15', text: 'text-accent-400' },
  Reading: { bg: 'bg-success-400/15', text: 'text-success-400' },
  Support: { bg: 'bg-warning-400/15', text: 'text-warning-400' },
  Project: { bg: 'bg-neon-400/15', text: 'text-neon-400' },
}

export default function GroupsPage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('1')
  const [filter, setFilter] = useState<'all' | 'Lab' | 'Reading' | 'Support' | 'Project'>('all')

  const filtered = filter === 'all' ? groups : groups.filter(g => g.type === filter)
  const totalStudents = new Set(groups.flatMap(g => g.students)).size

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
              <p className="text-xs text-surface-400">{groups.length} groups · {totalStudents} students</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Sparkles className="w-3.5 h-3.5" /> AI Group
            </motion.button>
            <button className="btn-secondary text-xs"><Shuffle className="w-3.5 h-3.5" /> Random</button>
            <button className="btn-secondary text-xs"><Plus className="w-3.5 h-3.5" /> New Group</button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Groups', value: groups.length, icon: Users, color: '#6366f1' },
            { label: 'Students', value: totalStudents, icon: UserPlus, color: '#10b981' },
            { label: 'Group Types', value: 4, icon: Target, color: '#f97316' },
            { label: 'Avg Size', value: Math.round(groups.reduce((a, g) => a + g.students.length, 0) / groups.length), icon: Star, color: '#ec4899' },
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
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex items-center gap-2">
          {(['all', 'Lab', 'Reading', 'Support', 'Project'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
              }`}
            >
              {f === 'all' ? 'All Groups' : f}
            </button>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((group, i) => {
          const isExpanded = expandedGroup === group.id
          const typeStyle = groupTypeColors[group.type]
          return (
            <motion.div
              key={group.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div className="h-1" style={{ backgroundColor: group.color }} />
              <button
                className="w-full p-5 text-left"
                onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{group.name}</h4>
                      <span className={`badge text-[10px] ${typeStyle.bg} ${typeStyle.text}`}>{group.type}</span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">{group.purpose}</p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex -space-x-2">
                    {group.students.slice(0, 4).map((s, si) => (
                      <div
                        key={s}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-surface-900"
                        style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}99)`, zIndex: 4 - si }}
                      >
                        {s.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {group.students.length > 4 && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-surface-400 text-[8px] font-bold bg-white/[0.06] border-2 border-surface-900">
                        +{group.students.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-surface-500">{group.students.length} members</span>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-white/[0.06]">
                      <div className="space-y-2 mt-3">
                        {group.students.map((s, si) => (
                          <motion.div
                            key={s}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: si * 0.04 }}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                              style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}99)` }}
                            >
                              {s.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm text-white flex-1">{s}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                        <button className="btn-secondary text-xs px-3 py-1.5"><UserPlus className="w-3 h-3" /> Add</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Edit3 className="w-3 h-3" /> Edit</button>
                        <button className="btn-secondary text-xs px-3 py-1.5"><Shuffle className="w-3 h-3" /> Reshuffle</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
