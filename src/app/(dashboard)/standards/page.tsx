'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Search, ChevronRight, ChevronDown, BookOpen, Check,
  Plus, Filter, Star, Globe, Zap, Target, ExternalLink, Link2,
  Layers, FileText, GraduationCap
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const frameworks = [
  { id: 'ccss', name: 'Common Core (CCSS)', icon: '\u{1F1FA}\u{1F1F8}', standards: 1465, aligned: 42, color: '#b0623f' },
  { id: 'ngss', name: 'NGSS Science', icon: '\u{1F52C}', standards: 286, aligned: 18, color: '#829c6e' },
  { id: 'ib',   name: 'International Baccalaureate', icon: '\u{1F30D}', standards: 340, aligned: 8, color: '#c67954' },
  { id: 'cam',  name: 'Cambridge (IGCSE)', icon: '\u{1F1EC}\u{1F1E7}', standards: 280, aligned: 5, color: '#dd9a33' },
  { id: 'ap',   name: 'AP Curriculum', icon: '\u{1F4DA}', standards: 192, aligned: 12, color: '#d97b63' },
  { id: 'state',name: 'State Standards', icon: '\u{1F4CB}', standards: 890, aligned: 15, color: '#6b8557' },
]

const ccssStandards = [
  {
    domain: 'Reading: Literature',
    code: 'RL',
    standards: [
      { code: 'RL.7.1', text: 'Cite several pieces of textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.', aligned: true, lessons: 3 },
      { code: 'RL.7.2', text: 'Determine a theme or central idea of a text and analyze its development over the course of the text.', aligned: true, lessons: 2 },
      { code: 'RL.7.3', text: 'Analyze how particular elements of a story or drama interact.', aligned: false, lessons: 0 },
      { code: 'RL.7.4', text: 'Determine the meaning of words and phrases as they are used in a text, including figurative and connotative meanings.', aligned: true, lessons: 1 },
    ]
  },
  {
    domain: 'Writing',
    code: 'W',
    standards: [
      { code: 'W.7.1', text: 'Write arguments to support claims with clear reasons and relevant evidence.', aligned: true, lessons: 4 },
      { code: 'W.7.2', text: 'Write informative/explanatory texts to examine a topic and convey ideas.', aligned: false, lessons: 0 },
      { code: 'W.7.3', text: 'Write narratives to develop real or imagined experiences using effective technique.', aligned: true, lessons: 2 },
    ]
  },
  {
    domain: 'Speaking & Listening',
    code: 'SL',
    standards: [
      { code: 'SL.7.1', text: 'Engage effectively in a range of collaborative discussions with diverse partners.', aligned: false, lessons: 0 },
      { code: 'SL.7.4', text: 'Present claims and findings, emphasizing salient points in a focused, coherent manner.', aligned: true, lessons: 1 },
    ]
  },
]

const alignmentStats = {
  total: 42,
  coverage: 73,
  gaps: 8,
  topSubject: 'English/ELA',
}

export default function StandardsPage() {
  const [selectedFramework, setSelectedFramework] = useState('ccss')
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['Reading: Literature'])
  const [search, setSearch] = useState('')

  function toggleDomain(domain: string) {
    setExpandedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const selectedFw = frameworks.find(f => f.id === selectedFramework)!

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#b0623f,#914d30)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">Standards Library</h2>
                <p className="text-xs text-surface-400">Align your curriculum to national and international standards</p>
              </div>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search standards..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-full border border-white/[0.08] bg-white/[0.04] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 w-56 transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Quick stats */}
      <FadeUp delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Standards Aligned', value: alignmentStats.total.toString(), icon: Check, color: 'bg-success-500/20 text-success-400' },
            { label: 'Coverage', value: `${alignmentStats.coverage}%`, icon: Target, color: 'bg-accent-500/20 text-accent-400' },
            { label: 'Gap Areas', value: alignmentStats.gaps.toString(), icon: Zap, color: 'bg-warning-500/20 text-warning-400' },
            { label: 'Top Subject', value: alignmentStats.topSubject, icon: Star, color: 'bg-electric-500/20 text-electric-400' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileHover={{ y: -2 }}
            >
              <div className={`icon-bubble ${s.color} mb-2`}><s.icon className="w-4 h-4" /></div>
              <div className="text-lg font-black text-white">{s.value}</div>
              <div className="text-xs text-surface-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Framework selector */}
        <FadeUp delay={0.15}>
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-white mb-3">Frameworks</h3>
            <div className="space-y-2">
              {frameworks.map((fw, i) => (
                <motion.button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selectedFramework === fw.id
                      ? 'bg-accent-500/10 border-2 border-accent-500/20'
                      : 'glass-card hover:border-accent-500/20'
                  }`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ x: 2 }}
                >
                  <span className="text-lg">{fw.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{fw.name}</p>
                    <p className="text-[10px] text-surface-500">{fw.aligned} aligned</p>
                  </div>
                  {selectedFramework === fw.id && <Check className="w-4 h-4 text-accent-400" />}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Standards list */}
        <FadeUp delay={0.2}>
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedFw.name}</h3>
                <p className="text-xs text-surface-400">{selectedFw.standards} standards · {selectedFw.aligned} aligned to your lessons</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5">
                  <Filter className="w-3 h-3" /> Filter
                </button>
                <button className="btn-primary text-xs px-3 py-1.5">
                  <Zap className="w-3 h-3" /> Auto-Align
                </button>
              </div>
            </div>

            {/* Coverage bar */}
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-surface-200">Alignment Coverage</span>
                <span className="text-xs font-bold text-accent-400">{alignmentStats.coverage}%</span>
              </div>
              <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#b0623f,#914d30)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${alignmentStats.coverage}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-500" /> Covered</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/[0.06]" /> Gap</span>
              </div>
            </div>

            {/* Standard domains */}
            <div className="space-y-3">
              {ccssStandards.map((domain, di) => (
                <motion.div
                  key={domain.domain}
                  className="glass-card overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + di * 0.08 }}
                >
                  <button
                    onClick={() => toggleDomain(domain.domain)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-500/20 text-accent-400 text-xs font-black">
                        {domain.code}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">{domain.domain}</p>
                        <p className="text-xs text-surface-500">{domain.standards.length} standards · {domain.standards.filter(s => s.aligned).length} aligned</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${
                      expandedDomains.includes(domain.domain) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  <AnimatePresence>
                    {expandedDomains.includes(domain.domain) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/[0.06]">
                          {domain.standards.map((std, si) => (
                            <motion.div
                              key={std.code}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.04 }}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                std.aligned ? 'bg-success-500/20' : 'bg-white/[0.06]'
                              }`}>
                                {std.aligned ? (
                                  <Check className="w-3 h-3 text-success-400" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-surface-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-accent-400">{std.code}</span>
                                  {std.lessons > 0 && (
                                    <span className="text-[10px] text-surface-500">{std.lessons} lesson{std.lessons !== 1 ? 's' : ''}</span>
                                  )}
                                </div>
                                <p className="text-xs text-surface-400 leading-relaxed mt-0.5">{std.text}</p>
                              </div>
                              {!std.aligned && (
                                <button className="btn-outline text-[10px] px-2 py-1 flex-shrink-0">
                                  <Link2 className="w-2.5 h-2.5" /> Align
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
