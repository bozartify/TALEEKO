'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, FileText, CheckCircle2, TrendingUp,
  ChevronDown, Check, Clock, Plus, Calendar, Download,
  Sparkles, CheckSquare
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type PlanType = 'IEP' | '504'

type AccommodationItem = {
  label: string
  implemented: boolean
}

type Student = {
  name: string
  planType: PlanType
  grade: string
  disabilityCategory: string
  reviewDate: string
  accommodations: AccommodationItem[]
  docStatus: 'complete' | 'incomplete' | 'overdue'
  meetingDate: string
}

const students: Student[] = [
  {
    name: 'Marcus Johnson',
    planType: 'IEP',
    grade: '7th',
    disabilityCategory: 'Specific Learning Disability',
    reviewDate: 'Sep 15, 2026',
    accommodations: [
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Audio text-to-speech', implemented: true },
      { label: 'Modified assignments', implemented: false },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Visual schedules', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Aug 12, 2026',
  },
  {
    name: 'Sofia Reyes',
    planType: '504',
    grade: '9th',
    disabilityCategory: 'ADHD',
    reviewDate: 'Oct 3, 2026',
    accommodations: [
      { label: 'Preferential seating', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Reduced homework load', implemented: false },
      { label: 'Visual schedules', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Sep 5, 2026',
  },
  {
    name: 'Ethan Park',
    planType: 'IEP',
    grade: '8th',
    disabilityCategory: 'Autism Spectrum',
    reviewDate: 'Aug 22, 2026',
    accommodations: [
      { label: 'Visual schedules', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Behavioral intervention plan', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Modified assignments', implemented: true },
      { label: 'Audio text-to-speech', implemented: false },
    ],
    docStatus: 'incomplete',
    meetingDate: 'Aug 8, 2026',
  },
  {
    name: 'Ava Thompson',
    planType: '504',
    grade: '10th',
    disabilityCategory: 'Anxiety Disorder',
    reviewDate: 'Nov 10, 2026',
    accommodations: [
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Reduced homework load', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Oct 20, 2026',
  },
  {
    name: 'Jaylen Carter',
    planType: 'IEP',
    grade: '7th',
    disabilityCategory: 'Speech/Language Impairment',
    reviewDate: 'Aug 5, 2026',
    accommodations: [
      { label: 'Audio text-to-speech', implemented: true },
      { label: 'Extended time (1.5x)', implemented: true },
      { label: 'Modified assignments', implemented: false },
      { label: 'Visual schedules', implemented: true },
      { label: 'Preferential seating', implemented: true },
    ],
    docStatus: 'overdue',
    meetingDate: 'Aug 1, 2026',
  },
  {
    name: 'Lily Nguyen',
    planType: 'IEP',
    grade: '6th',
    disabilityCategory: 'Emotional Disturbance',
    reviewDate: 'Sep 28, 2026',
    accommodations: [
      { label: 'Behavioral intervention plan', implemented: true },
      { label: 'Frequent breaks', implemented: true },
      { label: 'Preferential seating', implemented: true },
      { label: 'Reduced homework load', implemented: false },
      { label: 'Visual schedules', implemented: true },
      { label: 'Modified assignments', implemented: true },
    ],
    docStatus: 'complete',
    meetingDate: 'Sep 15, 2026',
  },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

const docStatusConfig = {
  complete:   { label: 'Complete',   colorClass: 'bg-success-400/15 text-success-400' },
  incomplete: { label: 'Incomplete', colorClass: 'bg-warning-400/15 text-warning-400' },
  overdue:    { label: 'Overdue',    colorClass: 'bg-danger-400/15 text-danger-400' },
}

export default function AccommodationsPage() {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  const toggleExpand = (name: string) => {
    setExpandedStudent(prev => (prev === name ? null : name))
  }

  const iepCount = students.filter(s => s.planType === 'IEP').length
  const fiveCount = students.filter(s => s.planType === '504').length
  const totalAccommodations = students.reduce((sum, s) => sum + s.accommodations.length, 0)
  const implementedCount = students.reduce(
    (sum, s) => sum + s.accommodations.filter(a => a.implemented).length,
    0,
  )
  const complianceRate = Math.round((implementedCount / totalAccommodations) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">IEP/504 Accommodations</h2>
              <p className="text-xs text-surface-400">Track and manage student accommodations</p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats row */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {[
          { label: 'IEP Students',          value: iepCount.toString(), icon: Users,        color: 'bg-accent-500/15 text-accent-400',   delta: 'Active plans' },
          { label: '504 Plans',             value: fiveCount.toString(), icon: FileText,     color: 'bg-electric-400/15 text-electric-400', delta: 'Active plans' },
          { label: 'Active Accommodations', value: totalAccommodations.toString(), icon: CheckCircle2, color: 'bg-success-400/15 text-success-400', delta: `${implementedCount} implemented` },
          { label: 'Compliance',            value: `${complianceRate}%`, icon: TrendingUp,   color: 'bg-warning-400/15 text-warning-400',  delta: 'Implementation rate' },
        ].map(s => (
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

      {/* Student Accommodations List */}
      <FadeUp delay={0.15}>
        <div className="space-y-3">
          {students.map((student, si) => {
            const isExpanded = expandedStudent === student.name
            const implementedAcc = student.accommodations.filter(a => a.implemented).length
            return (
              <motion.div
                key={student.name}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + si * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Student header row */}
                <button
                  onClick={() => toggleExpand(student.name)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-500/15 text-accent-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {getInitials(student.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{student.name}</h4>
                      <span className={`badge ${
                        student.planType === 'IEP'
                          ? 'bg-accent-500/15 text-accent-400'
                          : 'bg-electric-400/15 text-electric-400'
                      }`}>
                        {student.planType}
                      </span>
                    </div>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {student.grade} Grade &middot; {student.disabilityCategory} &middot; Review: {student.reviewDate}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-surface-500">
                      {implementedAcc}/{student.accommodations.length} implemented
                    </span>
                    <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-success-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(implementedAcc / student.accommodations.length) * 100}%` }}
                        transition={{ delay: 0.3 + si * 0.06, duration: 0.6 }}
                      />
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-surface-500" />
                  </motion.div>
                </button>

                {/* Expanded accommodations list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/[0.06]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          {student.accommodations.map((acc, ai) => (
                            <motion.div
                              key={acc.label}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ai * 0.04 }}
                            >
                              {acc.implemented ? (
                                <div className="w-6 h-6 rounded-lg bg-success-400/15 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3.5 h-3.5 text-success-400" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-warning-400/15 flex items-center justify-center flex-shrink-0">
                                  <Clock className="w-3.5 h-3.5 text-warning-400" />
                                </div>
                              )}
                              <span className="text-xs text-surface-200 font-medium">{acc.label}</span>
                              <span className={`ml-auto badge text-[10px] ${
                                acc.implemented
                                  ? 'bg-success-400/15 text-success-400'
                                  : 'bg-warning-400/15 text-warning-400'
                              }`}>
                                {acc.implemented ? 'Active' : 'Pending'}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </FadeUp>

      {/* Compliance Tracker */}
      <FadeInWhenVisible delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Annual Reviews */}
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-4 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Annual Reviews
            </h4>
            <div className="space-y-3">
              {students.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-accent-500/15 text-accent-400 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {getInitials(s.name)}
                    </div>
                    <span className="text-xs text-surface-200 font-medium truncate">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-surface-500 flex-shrink-0 ml-2">{s.reviewDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Status */}
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Documentation Status
            </h4>
            <div className="space-y-3">
              {students.map(s => {
                const cfg = docStatusConfig[s.docStatus]
                return (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-accent-500/15 text-accent-400 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <span className="text-xs text-surface-200 font-medium truncate">{s.name}</span>
                    </div>
                    <span className={`badge text-[10px] flex-shrink-0 ml-2 ${cfg.colorClass}`}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Meeting Schedule */}
          <div className="glass-card p-5">
            <h4 className="text-xs font-semibold text-surface-400 mb-4 flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5" /> Meeting Schedule
            </h4>
            <div className="space-y-3">
              {students
                .slice()
                .sort((a, b) => new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime())
                .map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-accent-500/15 text-accent-400 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <span className="text-xs text-surface-200 font-medium truncate">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-surface-500 flex-shrink-0 ml-2">{s.meetingDate}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Quick Actions */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-surface-400 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Generate Progress Report', icon: Sparkles,  gradient: true },
              { label: 'Schedule IEP Meeting',     icon: Calendar,  gradient: false },
              { label: 'Add Accommodation',        icon: Plus,      gradient: false },
              { label: 'Export Records',            icon: Download,  gradient: false },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                className={action.gradient ? 'btn-gradient text-xs w-full' : 'btn-secondary text-xs w-full'}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
