'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem, fadeUp, FadeInWhenVisible } from '@/components/ui/motion'
import {
  Layers, Sparkles, RefreshCw, Copy, Check, ChevronDown, ChevronRight,
  BookOpen, Target, Brain, Lightbulb, Users, AlertCircle, ArrowRight,
  Download, Star, CheckCircle, Clock, Zap, FileText, Search,
  ChevronUp, X, Bookmark, Share2, BarChart3, TrendingUp, Eye,
  ListChecks, MessageSquare, GraduationCap, Puzzle
} from 'lucide-react'

interface UnpackedStandard {
  code: string
  fullText: string
  grade: string
  subject: string
  studentFriendly: string
  parentFriendly: string
  prerequisites: string[]
  keyVocabulary: { term: string; definition: string }[]
  suggestedActivities: string[]
  assessmentIdeas: string[]
  commonMisconceptions: string[]
  differentiations: { level: string; strategy: string; color: string }[]
  estimatedDays: number
  bloomsLevels: string[]
  rigor: number
  relatedStandards: string[]
  crossCurricular: string[]
}

type ViewMode = 'teacher' | 'student' | 'parent'

const SAMPLE_STANDARD = `NGSS MS-LS1-6: Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms.`

const UNPACKED: UnpackedStandard = {
  code: 'MS-LS1-6',
  fullText: 'Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms.',
  grade: 'Middle School (6–8)',
  subject: 'Life Science / Biology',
  studentFriendly: 'I can explain HOW plants make food using sunlight, and WHY this is important for energy to move through living things. I can back up my explanation with real scientific evidence.',
  parentFriendly: 'Your child is learning how plants use sunlight to produce food (photosynthesis) and how this energy passes through ecosystems. They will conduct experiments and write explanations supported by scientific evidence.',
  prerequisites: [
    'Understanding of cells and cell structures (PS1-1)',
    'Basic knowledge of atoms and molecules',
    'Concept of energy transformation (PS3-1)',
    'Familiarity with matter and chemical reactions',
  ],
  keyVocabulary: [
    { term: 'Photosynthesis', definition: 'The process by which plants use sunlight, water, and CO₂ to make glucose' },
    { term: 'Chloroplast', definition: 'Organelle in plant cells where photosynthesis occurs' },
    { term: 'Chlorophyll', definition: 'Green pigment that captures light energy' },
    { term: 'Glucose', definition: 'Sugar produced during photosynthesis; the plant\'s energy source' },
    { term: 'Carbon dioxide', definition: 'Gas absorbed by plants from the air during photosynthesis' },
    { term: 'Cellular respiration', definition: 'Process cells use to convert glucose into usable energy (ATP)' },
    { term: 'Energy transformation', definition: 'Change from one form of energy (e.g., light) to another (chemical)' },
    { term: 'Matter cycling', definition: 'How atoms move between organisms and the environment' },
    { term: 'Autotroph', definition: 'Organism that makes its own food using energy from the environment' },
    { term: 'Producer', definition: 'Organism at the base of a food chain that creates food through photosynthesis' },
  ],
  suggestedActivities: [
    'Floating Disk Lab: use spinach leaf disks to measure photosynthesis rates under different light conditions',
    'Energy Flow Diagram: trace energy from sun → producer → consumer and model where energy goes',
    'Photosynthesis + Respiration Equation Matching Card Sort',
    'Compare/contrast photosynthesis and cellular respiration using a Venn diagram',
    'Elodea Aquatic Plant Lab: count oxygen bubbles under different light intensities',
  ],
  assessmentIdeas: [
    'Constructed Response: Given a diagram of a food web, explain where all the energy originally comes from',
    'CER (Claim-Evidence-Reasoning) paragraph about the spinach lab results',
    'Analogy: compare photosynthesis to making food in a kitchen — what are the "ingredients" and "appliances"?',
    'Exit Ticket: traffic light — how confident are you that you can explain the carbon cycle?',
  ],
  commonMisconceptions: [
    'Plants get food FROM the soil (they MAKE food using CO₂ + water + light)',
    'Photosynthesis and respiration are opposites and cancel each other out',
    'Only green parts of a plant photosynthesize',
    'Plants only photosynthesize during the day (they do cellular respiration all the time)',
  ],
  differentiations: [
    { level: 'Support (IEP/ELL)', strategy: 'Graphic organizer with fill-in-the-blank equation; picture vocabulary cards for key terms; simplified lab with visual data tables', color: '#ef4444' },
    { level: 'On-Grade', strategy: 'Spinach disk lab with guided data analysis; CER framework for written explanation; concept mapping activity', color: '#22d3ee' },
    { level: 'Extension', strategy: 'Investigate how CO₂ concentration and temperature affect photosynthesis rate; connect to climate change and carbon sequestration research', color: '#10b981' },
  ],
  estimatedDays: 5,
  bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze'],
  rigor: 4,
  relatedStandards: ['MS-LS1-7', 'MS-LS2-3', 'MS-PS3-3', 'CCSS.ELA-LITERACY.RST.6-8.1'],
  crossCurricular: ['Math: Graphing data from Elodea lab (6.SP.B.4)', 'ELA: Writing CER paragraph (W.7.1)', 'Math: Calculating percentage of light absorption'],
}

const recentUnpacked = [
  { code: 'CCSS.ELA-W.7.1', subject: 'ELA', desc: 'Write arguments to support claims', date: '2h ago', color: '#8b5cf6', bloomsLevels: ['Analyze', 'Evaluate', 'Create'] },
  { code: 'CCSS.MATH.6.NS.A.1', subject: 'Math', desc: 'Interpret and compute quotients of fractions', date: 'Yesterday', color: '#22d3ee', bloomsLevels: ['Understand', 'Apply'] },
  { code: 'NGSS HS-LS3-1', subject: 'Biology', desc: 'Ask questions about heredity and genetic variation', date: '3 days ago', color: '#10b981', bloomsLevels: ['Remember', 'Analyze'] },
  { code: 'C3.D2.His.1.6-8', subject: 'Social Studies', desc: 'Analyze connections among events and developments', date: '1 week ago', color: '#f97316', bloomsLevels: ['Analyze', 'Evaluate'] },
]

const frameworks = [
  { id: 'ngss',  label: 'NGSS',        flag: '🔬', color: '#14b8a6' },
  { id: 'ccss',  label: 'Common Core',  flag: '📐', color: '#6366f1' },
  { id: 'ap',    label: 'AP',           flag: '🎓', color: '#f43f5e' },
  { id: 'c3',    label: 'C3 (SS)',      flag: '🌎', color: '#f59e0b' },
  { id: 'state', label: 'State',        flag: '📋', color: '#8b5cf6' },
]

const BLOOMS_LADDER = [
  { level: 'Create',    color: '#ec4899', desc: 'Design, construct, produce' },
  { level: 'Evaluate',  color: '#f97316', desc: 'Judge, argue, defend' },
  { level: 'Analyze',   color: '#8b5cf6', desc: 'Differentiate, organize' },
  { level: 'Apply',     color: '#6366f1', desc: 'Execute, implement' },
  { level: 'Understand',color: '#22d3ee', desc: 'Classify, explain' },
  { level: 'Remember',  color: '#10b981', desc: 'List, recall, recognize' },
]

const RIGOR_LABELS = ['', 'Surface', 'Developing', 'Proficient', 'Deep', 'Transfer']

export default function StandardsUnpackerPage() {
  const [input, setInput] = useState(SAMPLE_STANDARD)
  const [framework, setFramework] = useState('ngss')
  const [generating, setGenerating] = useState(false)
  const [unpacked, setUnpacked] = useState<UnpackedStandard | null>(UNPACKED)
  const [expandedSection, setExpandedSection] = useState<string | null>('studentFriendly')
  const [copied, setCopied] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('teacher')
  const [aiOpen, setAiOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [savedStandards, setSavedStandards] = useState<Set<string>>(new Set())
  const [showVocabDefs, setShowVocabDefs] = useState(false)
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  async function handleUnpack() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    const raw = input.trim()
    const codeMatch = raw.match(/^([A-Z0-9\.\-]+)/)
    const code = codeMatch ? codeMatch[1] : 'Custom Standard'
    const isCustom = !codeMatch || raw.length > 30
    const verbsFound = raw.match(/\b(analyze|evaluate|create|understand|explain|construct|describe|identify|compare|argue|demonstrate|develop|apply|solve|interpret|design|classify|justify|synthesize)\b/gi)?.slice(0, 6)
    const dynamicUnpacked: UnpackedStandard = {
      ...UNPACKED,
      code,
      fullText: raw,
      studentFriendly: isCustom
        ? `I can understand and apply the ideas in: "${raw.slice(0, 80)}${raw.length > 80 ? '…' : ''}"`
        : UNPACKED.studentFriendly,
      assessmentIdeas: isCustom
        ? [
            `Exit ticket: Summarize the key idea of ${code} in 2–3 sentences`,
            `Performance task: Apply ${code} concepts to a real-world scenario`,
            `Multiple choice quiz assessing key vocabulary and concepts`,
            `Written explanation with evidence using the RACE strategy`,
          ]
        : UNPACKED.assessmentIdeas,
      bloomsLevels: verbsFound && verbsFound.length > 0 ? verbsFound : UNPACKED.bloomsLevels,
    }
    setUnpacked(dynamicUnpacked)
    setGenerating(false)
    setExpandedSection('studentFriendly')
  }

  function copySection(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedSection(id)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  function handleCopy() {
    if (!unpacked) return
    const text = [
      `Standard: ${unpacked.code}`,
      `"${unpacked.fullText}"`,
      `\nStudent-Friendly: ${unpacked.studentFriendly}`,
      `\nPrerequisites:\n${unpacked.prerequisites.map(p => `• ${p}`).join('\n')}`,
      `\nKey Vocabulary: ${unpacked.keyVocabulary.map(v => v.term).join(', ')}`,
      `\nSuggested Activities:\n${unpacked.suggestedActivities.map(a => `• ${a}`).join('\n')}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleSave(code: string) {
    setSavedStandards(prev => {
      const n = new Set(prev)
      n.has(code) ? n.delete(code) : n.add(code)
      return n
    })
  }

  const sections = unpacked ? [
    {
      id: 'studentFriendly',
      label: viewMode === 'teacher' ? 'Student-Friendly "I Can" Statement' : viewMode === 'student' ? 'What You\'re Learning' : 'For Parents',
      icon: Users,
      color: '#10b981',
      copyText: viewMode === 'parent' ? unpacked.parentFriendly : unpacked.studentFriendly,
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-success-500/5 border border-success-500/20">
            <p className="text-sm text-success-300 leading-relaxed font-medium">
              &ldquo;{viewMode === 'parent' ? unpacked.parentFriendly : unpacked.studentFriendly}&rdquo;
            </p>
          </div>
          {viewMode === 'teacher' && (
            <p className="text-[11px] text-surface-500">Post this in your classroom or share with students at the start of the unit.</p>
          )}
        </div>
      )
    },
    {
      id: 'prerequisites',
      label: `Prerequisites (${unpacked.prerequisites.length})`,
      icon: ChevronRight, color: '#f59e0b',
      copyText: unpacked.prerequisites.join('\n'),
      content: (
        <ul className="space-y-2">
          {unpacked.prerequisites.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-surface-300">
              <div className="w-5 h-5 rounded-full bg-warning-500/10 text-warning-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              {p}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'vocabulary',
      label: `Key Vocabulary (${unpacked.keyVocabulary.length} terms)`,
      icon: BookOpen, color: '#6366f1',
      copyText: unpacked.keyVocabulary.map(v => `${v.term}: ${v.definition}`).join('\n'),
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setShowVocabDefs(false)}
              className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-all ${!showVocabDefs ? 'bg-accent-500/20 text-accent-300' : 'text-surface-500 hover:text-surface-300'}`}
            >
              Term chips
            </button>
            <button
              onClick={() => setShowVocabDefs(true)}
              className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-all ${showVocabDefs ? 'bg-accent-500/20 text-accent-300' : 'text-surface-500 hover:text-surface-300'}`}
            >
              With definitions
            </button>
          </div>
          {showVocabDefs ? (
            <div className="space-y-2">
              {unpacked.keyVocabulary.map(v => (
                <div key={v.term} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <span className="text-xs font-bold text-accent-300 flex-shrink-0 w-28">{v.term}</span>
                  <span className="text-xs text-surface-400">{v.definition}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unpacked.keyVocabulary.map(v => (
                <button
                  key={v.term}
                  className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition-all ${
                    selectedVocab === v.term
                      ? 'border-accent-500/40 bg-accent-500/15 text-accent-200'
                      : 'border-accent-500/20 bg-accent-500/10 text-accent-300 hover:border-accent-500/40'
                  }`}
                  onClick={() => setSelectedVocab(selectedVocab === v.term ? null : v.term)}
                >
                  {v.term}
                </button>
              ))}
              {selectedVocab && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full mt-1 p-3 rounded-xl bg-accent-500/[0.08] border border-accent-500/20 overflow-hidden"
                  >
                    <p className="text-[10px] font-bold text-accent-400 mb-1">{selectedVocab}</p>
                    <p className="text-xs text-surface-300">{unpacked.keyVocabulary.find(v => v.term === selectedVocab)?.definition}</p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'activities',
      label: `Suggested Activities (${unpacked.suggestedActivities.length})`,
      icon: Zap, color: '#22d3ee',
      copyText: unpacked.suggestedActivities.join('\n'),
      content: (
        <ul className="space-y-2">
          {unpacked.suggestedActivities.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <Star className="w-3.5 h-3.5 text-electric-400 mt-0.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'assessments',
      label: `Assessment Ideas (${unpacked.assessmentIdeas.length})`,
      icon: Target, color: '#ec4899',
      copyText: unpacked.assessmentIdeas.join('\n'),
      content: (
        <ul className="space-y-2">
          {unpacked.assessmentIdeas.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <CheckCircle className="w-3.5 h-3.5 text-neon-400 mt-0.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'misconceptions',
      label: `Common Misconceptions (${unpacked.commonMisconceptions.length})`,
      icon: AlertCircle, color: '#ef4444',
      copyText: unpacked.commonMisconceptions.join('\n'),
      content: (
        <ul className="space-y-2">
          {unpacked.commonMisconceptions.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <AlertCircle className="w-3.5 h-3.5 text-danger-400 mt-0.5 flex-shrink-0" />
              {m}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'differentiation',
      label: 'Differentiation Strategies',
      icon: Users, color: '#8b5cf6',
      copyText: unpacked.differentiations.map(d => `${d.level}: ${d.strategy}`).join('\n\n'),
      content: (
        <div className="space-y-3">
          {unpacked.differentiations.map((d, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: d.color }}>{d.level}</p>
              <p className="text-xs text-surface-400">{d.strategy}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'crossCurricular',
      label: `Cross-Curricular Connections (${unpacked.crossCurricular.length})`,
      icon: Puzzle, color: '#f97316',
      copyText: unpacked.crossCurricular.join('\n'),
      content: (
        <ul className="space-y-2">
          {unpacked.crossCurricular.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-surface-300">
              <ArrowRight className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      )
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Export Modal */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card p-6 w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Export Standard Breakdown</h3>
                <button onClick={() => setExportOpen(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-400"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Export as PDF', icon: FileText, desc: 'Full breakdown in printable format' },
                  { label: 'Copy to Clipboard', icon: Copy, desc: 'Plain text for pasting anywhere' },
                  { label: 'Share Link', icon: Share2, desc: 'Generate a shareable read-only link' },
                  { label: 'Export to Google Docs', icon: FileText, desc: 'Open directly in Google Docs' },
                ].map(opt => (
                  <button
                    key={opt.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                    onClick={() => {
                      if (opt.label === 'Copy to Clipboard') { handleCopy(); showToast('Standard copied to clipboard!') }
                      else if (opt.label === 'Export as PDF') showToast('Exporting standard breakdown as PDF…')
                      else if (opt.label === 'Share Link') showToast('Share link copied to clipboard!')
                      else if (opt.label === 'Export to Google Docs') showToast('Opening in Google Docs…')
                      setExportOpen(false)
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                      <opt.icon className="w-4 h-4 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.label}</p>
                      <p className="text-[10px] text-surface-400">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}>
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Standards Unpacker</h1>
                  <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-bold border border-teal-500/20">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400">Instantly unpack any standard into student-friendly language, activities, and assessments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('Share link copied!')}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </motion.button>
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => setExportOpen(true)}>
                <Download className="w-3.5 h-3.5" /> Export
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={handleUnpack} disabled={generating}>
                <Sparkles className="w-3.5 h-3.5" />
                {generating ? 'Unpacking…' : 'Unpack Standard'}
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Framework</span>
              <span className="text-xs font-bold text-white">{frameworks.find(f => f.id === framework)?.label ?? 'NGSS'}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Vocab Terms</span>
              <span className="text-xs font-bold text-white">{unpacked?.keyVocabulary.length ?? 10}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Activities</span>
              <span className="text-xs font-bold text-white">{unpacked?.suggestedActivities.length ?? 5}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Assessment Ideas</span>
              <span className="text-xs font-bold text-white">{unpacked?.assessmentIdeas.length ?? 4}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Rigor Level</span>
              <span className="text-xs font-bold text-white">{unpacked?.rigor ?? 4}/5</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* AI Insights Panel */}
      <FadeUp delay={0.05}>
        <div className="glass-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
            onClick={() => setAiOpen(o => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Curriculum Insights</span>
              <span className="bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 alerts</span>
            </div>
            <motion.div animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </motion.div>
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
                    <AlertCircle className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-warning-300">Prerequisite Gap Detected</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">4 of your students have not yet mastered PS1-1 (cell structures), a prerequisite for this standard. Consider a quick pre-assessment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-500/[0.08] border border-teal-500/20">
                    <TrendingUp className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-teal-300">High Rigor Standard</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">MS-LS1-6 requires Level 4 (Deep) cognitive demand. Your class average is currently Level 3. Plan 2+ scaffolded lessons before the CER assessment.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-500/[0.08] border border-accent-500/20">
                    <Lightbulb className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-accent-300">Cross-Curricular Opportunity</p>
                      <p className="text-[11px] text-surface-400 mt-0.5">This standard aligns with CCSS.ELA W.7.1 (argumentative writing). Co-plan with your ELA colleague to reinforce CER writing skills simultaneously.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Input + Tools */}
        <div className="xl:col-span-1 space-y-4">
          {/* Framework selector */}
          <FadeUp delay={0.06}>
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Standards Framework</p>
              <div className="space-y-1.5">
                {frameworks.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFramework(f.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                      framework === f.id ? 'border-accent-500/30 bg-accent-500/5' : 'border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="text-base">{f.flag}</span>
                    <span className={`text-xs font-medium flex-1 ${framework === f.id ? 'text-accent-300' : 'text-surface-300'}`}>{f.label}</span>
                    {framework === f.id && <Check className="w-3.5 h-3.5 text-accent-400" />}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Standard Input */}
          <FadeUp delay={0.1}>
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Standard to Unpack</p>
                <button onClick={() => setInput('')} className="text-[11px] text-surface-500 hover:text-surface-300">Clear</button>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none leading-relaxed"
                placeholder={'Paste your standard code or full text here…\ne.g. CCSS.ELA-LITERACY.W.7.1\nor paste the full standard text'}
              />
              <motion.button
                onClick={handleUnpack}
                disabled={generating || !input.trim()}
                className="btn-gradient text-xs px-4 py-2 w-full justify-center disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {generating
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Unpacking…</>
                  : <><Sparkles className="w-3.5 h-3.5" />Unpack Standard</>
                }
              </motion.button>
            </div>
          </FadeUp>

          {/* Bloom's Taxonomy Ladder */}
          <FadeUp delay={0.13}>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-accent-400" />
                <p className="text-xs font-bold text-white">Bloom&apos;s Taxonomy</p>
              </div>
              <div className="space-y-1.5">
                {BLOOMS_LADDER.map(b => {
                  const isActive = unpacked?.bloomsLevels.includes(b.level)
                  return (
                    <div
                      key={b.level}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${isActive ? 'bg-white/[0.06]' : 'opacity-40'}`}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold" style={{ color: b.color }}>{b.level}</span>
                          {isActive && <Check className="w-3 h-3" style={{ color: b.color }} />}
                        </div>
                        <p className="text-[9px] text-surface-500">{b.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {unpacked && (
                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="text-[10px] text-surface-500">This standard targets <span className="text-white font-semibold">{unpacked.bloomsLevels.length} of 6</span> Bloom&apos;s levels</p>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Rigor Meter */}
          {unpacked && (
            <FadeUp delay={0.16}>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-warning-400" />
                  <p className="text-xs font-bold text-white">Cognitive Rigor</p>
                </div>
                {(() => {
                  const segColors = ['#6366f1', '#8b5cf6', '#a855f7', '#f59e0b', '#f97316']
                  const W = 280, H = 20, GAP = 6
                  const segW = (W - GAP * 4) / 5
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-2">
                      {[1, 2, 3, 4, 5].map((n, i) => {
                        const x = i * (segW + GAP)
                        const active = n <= unpacked.rigor
                        return (
                          <g key={n}>
                            <rect x={x} y={5} width={segW} height={10} rx={5} fill="rgba(255,255,255,0.06)" />
                            {active && (
                              <motion.rect x={x} y={5} height={10} rx={5} fill={segColors[i]}
                                initial={{ width: 0 }} animate={{ width: segW }}
                                transition={{ delay: 0.4 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
                              />
                            )}
                          </g>
                        )
                      })}
                    </svg>
                  )
                })()}
                <div className="flex justify-between text-[9px] text-surface-500">
                  <span>Surface</span>
                  <span className="text-warning-400 font-bold">Level {unpacked.rigor}: {RIGOR_LABELS[unpacked.rigor]}</span>
                  <span>Transfer</span>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Recent History */}
          <FadeUp delay={0.18}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Recent</p>
                <button className="text-[10px] text-accent-400 hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {recentUnpacked.map(r => (
                  <button key={r.code} className="w-full flex items-start gap-2.5 text-left hover:bg-white/[0.03] rounded-xl px-2 py-2 transition-colors group">
                    <div className="w-1 h-12 rounded-full flex-shrink-0 mt-0.5" style={{ background: r.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-surface-200 group-hover:text-white transition-colors">{r.code}</p>
                      <p className="text-[10px] text-surface-500 truncate">{r.desc}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {r.bloomsLevels.slice(0, 2).map(b => (
                          <span key={b} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-400">{b}</span>
                        ))}
                        <span className="text-[9px] text-surface-600 ml-auto">{r.date}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right: Results */}
        <div className="xl:col-span-2">
          {unpacked ? (
            <div className="space-y-3">
              {/* Standard header + actions */}
              <FadeUp delay={0.08}>
                <div className="glass-card p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-sm font-bold px-2.5 py-1 rounded-xl" style={{ background: '#14b8a620', color: '#14b8a6' }}>{unpacked.code}</span>
                        <span className="text-xs text-surface-400">{unpacked.grade}</span>
                        <span className="text-xs text-surface-600">·</span>
                        <span className="text-xs text-surface-400">{unpacked.subject}</span>
                      </div>
                      <p className="text-sm text-surface-300 leading-relaxed">&ldquo;{unpacked.fullText}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <motion.button
                        onClick={() => toggleSave(unpacked.code)}
                        className={`p-2 rounded-xl transition-colors ${savedStandards.has(unpacked.code) ? 'text-warning-400 bg-warning-500/10' : 'text-surface-500 hover:bg-white/[0.06]'}`}
                        whileHover={{ scale: 1.05 }}
                        title="Save standard"
                      >
                        <Bookmark className="w-4 h-4" />
                      </motion.button>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-xl text-surface-500 hover:bg-white/[0.06] transition-colors"
                        title="Copy all"
                      >
                        {copied ? <Check className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setExportOpen(true)}
                        className="btn-secondary text-xs px-3 py-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 flex-wrap mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-surface-400">
                      <Clock className="w-3.5 h-3.5 text-warning-400" />
                      <span>~{unpacked.estimatedDays} teaching days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unpacked.bloomsLevels.map(b => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">{b}</span>
                      ))}
                    </div>
                  </div>

                  {/* View mode switcher */}
                  <div className="mt-4 flex items-center gap-1 bg-white/[0.04] rounded-full p-1 w-fit">
                    {([
                      { key: 'teacher' as const, label: 'Teacher View', icon: GraduationCap },
                      { key: 'student' as const, label: 'Student View', icon: Brain },
                      { key: 'parent' as const, label: 'Parent View', icon: Users },
                    ]).map(v => (
                      <button
                        key={v.key}
                        onClick={() => setViewMode(v.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                          viewMode === v.key ? 'bg-white/[0.1] text-white' : 'text-surface-400 hover:text-surface-200'
                        }`}
                      >
                        <v.icon className="w-3 h-3" />
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Related standards */}
              <FadeInWhenVisible>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="w-4 h-4 text-electric-400" />
                    <span className="text-xs font-bold text-white">Related Standards</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unpacked.relatedStandards.map(s => (
                      <motion.button
                        key={s}
                        className="px-2.5 py-1 rounded-lg border border-electric-500/20 bg-electric-500/10 text-[10px] font-semibold text-electric-300 hover:border-electric-500/40 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Accordion sections */}
              {sections.map((section, si) => {
                const isExpanded = expandedSection === section.id
                return (
                  <FadeInWhenVisible key={section.id} delay={si * 0.04}>
                    <div className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: section.color + '20' }}>
                          <section.icon className="w-4 h-4" style={{ color: section.color }} />
                        </div>
                        <span className="text-sm font-semibold text-surface-200 flex-1">{section.label}</span>
                        <div className="flex items-center gap-2">
                          {isExpanded && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-1 rounded-lg hover:bg-white/[0.08] text-surface-500 hover:text-surface-300 transition-colors"
                              onClick={e => { e.stopPropagation(); copySection(section.id, section.copyText) }}
                              title="Copy section"
                            >
                              {copiedSection === section.id ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </motion.button>
                          )}
                          <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/[0.06] px-4 py-4 overflow-hidden"
                          >
                            {section.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeInWhenVisible>
                )
              })}
            </div>
          ) : (
            <FadeUp delay={0.1}>
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-surface-200 mb-2">Paste a Standard to Get Started</h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto">Paste any NGSS, CCSS, AP, or state standard and AI will break it down into student-friendly language, activities, vocabulary, and more.</p>
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {[
                    { icon: '🎯', label: 'I Can Statements' },
                    { icon: '📚', label: 'Vocabulary' },
                    { icon: '⚡', label: 'Activities' },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <div className="text-xl mb-1">{f.icon}</div>
                      <p className="text-[10px] text-surface-400">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
