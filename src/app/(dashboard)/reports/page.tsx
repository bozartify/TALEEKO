'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Download, Sparkles, Calendar, Users, BarChart2,
  TrendingUp, BookOpen, ClipboardList, Filter, ChevronDown,
  FileSpreadsheet, File, Loader2, Check, ArrowRight
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const reportTypes = [
  {
    id: 'progress',
    title: 'Student Progress Report',
    desc: 'Comprehensive individual student performance across all assessments',
    icon: TrendingUp,
    color: '#dd9a33',
    fields: ['Student', 'Date Range', 'Include: Grades, Attendance, Comments'],
  },
  {
    id: 'class',
    title: 'Class Performance Summary',
    desc: 'Aggregate class data with distribution charts and insights',
    icon: Users,
    color: '#b0623f',
    fields: ['Class', 'Subject', 'Assessment Type'],
  },
  {
    id: 'curriculum',
    title: 'Curriculum Coverage Report',
    desc: 'Standards alignment and coverage gaps analysis',
    icon: BookOpen,
    color: '#14b8a6',
    fields: ['Course', 'Standards Framework', 'Time Period'],
  },
  {
    id: 'engagement',
    title: 'Engagement Analytics',
    desc: 'AI-analyzed engagement patterns and intervention recommendations',
    icon: BarChart2,
    color: '#f97316',
    fields: ['Class', 'Metric Type', 'Comparison Period'],
  },
  {
    id: 'assessment',
    title: 'Assessment Results',
    desc: 'Detailed quiz and test results with item analysis',
    icon: ClipboardList,
    color: '#ec4899',
    fields: ['Assessment', 'Include: Statistics, Item Analysis, Student Breakdown'],
  },
  {
    id: 'ai-usage',
    title: 'AI Usage Report',
    desc: 'Track AI tool usage, generation counts, and time saved',
    icon: Sparkles,
    color: '#829c6e',
    fields: ['Date Range', 'Tool Category', 'Include: Costs, Time Saved'],
  },
]

const recentReports = [
  { title: '10th Grade Progress - Q3', type: 'Student Progress', date: 'Jul 15, 2026', format: 'PDF', size: '2.4 MB' },
  { title: 'AP Biology Class Summary', type: 'Class Performance', date: 'Jul 12, 2026', format: 'XLSX', size: '1.1 MB' },
  { title: 'Standards Coverage - NGSS', type: 'Curriculum Coverage', date: 'Jul 8, 2026', format: 'PDF', size: '3.8 MB' },
  { title: 'Weekly Engagement Report', type: 'Engagement', date: 'Jul 7, 2026', format: 'PDF', size: '890 KB' },
  { title: 'Mid-term Assessment Analysis', type: 'Assessment', date: 'Jul 1, 2026', format: 'XLSX', size: '1.5 MB' },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  function handleGenerate() {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #dd9a33, #bc7d24)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <FileText className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Reports & Exports</h2>
              <p className="text-xs text-surface-400">AI-generated reports · Export to PDF, XLSX, CSV</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Schedule
            </button>
            <button className="btn-secondary text-xs px-3 py-1.5">
              <Filter className="w-3.5 h-3.5" />
              History
            </button>
          </div>
        </div>
      </FadeUp>

      <AnimatePresence>
        {generating && (
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #dd9a33, #b0623f)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-lg font-black text-white mb-1">Generating Report...</h3>
            <p className="text-sm text-surface-400">AI is analyzing data and creating your report</p>
            <motion.div className="w-48 h-1.5 bg-accent-500/15 rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-accent-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generated && !generating && (
          <motion.div
            className="glass-card p-6 border-success-500/20"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Report Generated Successfully</h4>
                <p className="text-xs text-surface-400">Your report is ready for download</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5"><File className="w-3.5 h-3.5" /> PDF</button>
                <button className="btn-secondary text-xs px-3 py-1.5"><FileSpreadsheet className="w-3.5 h-3.5" /> XLSX</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!generating && (
        <>
          <FadeUp delay={0.1}>
            <div>
              <h3 className="text-base font-bold text-white mb-4">Generate New Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((report, i) => (
                  <motion.button
                    key={report.id}
                    className={`glass-card p-5 text-left transition-all ${
                      selectedReport === report.id ? 'border-accent-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : ''
                    }`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: report.color + '18' }}
                      >
                        <report.icon className="w-4.5 h-4.5" style={{ color: report.color }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{report.title}</h4>
                        <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{report.desc}</p>
                      </div>
                    </div>
                    {selectedReport === report.id && (
                      <motion.div
                        className="mt-3 pt-3 border-t border-white/[0.06]"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {report.fields.map(f => (
                            <span key={f} className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-surface-400 rounded-full">{f}</span>
                          ))}
                        </div>
                        <motion.button
                          className="btn-gradient text-xs mt-3 w-full"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleGenerate() }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate with AI
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeInWhenVisible delay={0.2}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Recent Reports</h3>
                <button className="text-xs text-accent-400 hover:text-accent-300">View All</button>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Report</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Type</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Date</th>
                      <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Format</th>
                      <th className="text-right text-xs font-semibold text-surface-300 px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report, i) => (
                      <motion.tr
                        key={i}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-white">{report.title}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-400">{report.type}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-500">{report.date}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            report.format === 'PDF' ? 'bg-danger-500/15 text-danger-400' : 'bg-success-500/15 text-success-400'
                          }`}>
                            {report.format}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button className="text-surface-500 hover:text-surface-300 p-1">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInWhenVisible>
        </>
      )}
    </div>
  )
}
