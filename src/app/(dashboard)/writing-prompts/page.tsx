'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp, StaggerList, StaggerItem } from '@/components/ui/motion'
import {
  Pencil, Sparkles, RefreshCw, Copy, Star, Filter, Search,
  ChevronDown, BookOpen, Brain, Target, Zap, Plus, Download,
  Share2, Clock, Users, CheckCircle, Heart, Flame, Lightbulb,
  FileText, Layers, Tag, BarChart3
} from 'lucide-react'

type PromptMode = 'narrative' | 'persuasive' | 'expository' | 'descriptive' | 'creative' | 'reflective' | 'research'
type GradeRange = 'K-2' | '3-5' | '6-8' | '9-12' | 'College'
type DifficultyLevel = 'scaffolded' | 'standard' | 'advanced' | 'open-ended'
type Subject = 'ELA' | 'Science' | 'Social Studies' | 'Math' | 'Art' | 'Any'

interface WritingPrompt {
  id: string
  title: string
  mode: PromptMode
  grade: GradeRange
  difficulty: DifficultyLevel
  subject: Subject
  timeEstimate: number
  prompt: string
  scaffoldQuestions: string[]
  rubricFocus: string[]
  starred: boolean
  usageCount: number
  tags: string[]
}

const modeConfig: Record<PromptMode, { label: string; color: string; icon: string }> = {
  narrative:   { label: 'Narrative',   color: '#6366f1', icon: '📖' },
  persuasive:  { label: 'Persuasive',  color: '#f97316', icon: '🎯' },
  expository:  { label: 'Expository',  color: '#14b8a6', icon: '📋' },
  descriptive: { label: 'Descriptive', color: '#8b5cf6', icon: '🎨' },
  creative:    { label: 'Creative',    color: '#ec4899', icon: '✨' },
  reflective:  { label: 'Reflective',  color: '#10b981', icon: '💭' },
  research:    { label: 'Research',    color: '#22d3ee', icon: '🔍' },
}

const difficultyConfig: Record<DifficultyLevel, { label: string; color: string }> = {
  scaffolded:  { label: 'Scaffolded',  color: '#10b981' },
  standard:    { label: 'Standard',    color: '#6366f1' },
  advanced:    { label: 'Advanced',    color: '#f97316' },
  'open-ended': { label: 'Open-Ended', color: '#8b5cf6' },
}

const PROMPTS: WritingPrompt[] = [
  {
    id: '1',
    title: 'The Unexpected Hero',
    mode: 'narrative',
    grade: '6-8',
    difficulty: 'standard',
    subject: 'ELA',
    timeEstimate: 45,
    prompt: 'Write a short story about an ordinary person who accidentally becomes a hero in their community. Focus on how their small, everyday actions create a ripple effect that changes everything. Show, don\'t tell — use specific details, dialogue, and sensory imagery to bring your character to life.',
    scaffoldQuestions: [
      'Who is your character? What makes them "ordinary"?',
      'What problem exists in the community?',
      'What accidental action starts the change?',
      'How do others react? What challenges arise?',
      'How does your character grow or change by the end?',
    ],
    rubricFocus: ['Narrative structure', 'Character development', 'Sensory details', 'Dialogue', 'Theme'],
    starred: true,
    usageCount: 47,
    tags: ['hero journey', 'community', 'character', 'plot'],
  },
  {
    id: '2',
    title: 'Should Schools Have Later Start Times?',
    mode: 'persuasive',
    grade: '9-12',
    difficulty: 'standard',
    subject: 'ELA',
    timeEstimate: 60,
    prompt: 'Write a well-structured persuasive essay arguing for or against later school start times. Use at least three pieces of evidence from credible sources, address a counterargument, and propose a specific policy recommendation in your conclusion.',
    scaffoldQuestions: [
      'What is your position (for/against)?',
      'What are your three strongest evidence-based arguments?',
      'What would someone who disagrees say? How would you counter it?',
      'What specific policy change are you recommending?',
    ],
    rubricFocus: ['Claim/thesis', 'Evidence quality', 'Counterargument', 'Call to action', 'Transitions'],
    starred: false,
    usageCount: 31,
    tags: ['health', 'policy', 'research', 'argument'],
  },
  {
    id: '3',
    title: 'The Water Cycle Explained',
    mode: 'expository',
    grade: '3-5',
    difficulty: 'scaffolded',
    subject: 'Science',
    timeEstimate: 30,
    prompt: 'Imagine you are a water droplet. Explain the water cycle from your perspective, describing each stage — evaporation, condensation, precipitation, and collection — and what happens to you along the journey. Use at least 4 science vocabulary words you\'ve learned.',
    scaffoldQuestions: [
      'Where do you start your journey as a water droplet?',
      'What does evaporation feel like? Where do you go?',
      'What happens when you become part of a cloud?',
      'How do you fall back to Earth? Where do you land?',
    ],
    rubricFocus: ['Scientific accuracy', 'Vocabulary use', 'Sequencing', 'Voice', 'Completeness'],
    starred: true,
    usageCount: 89,
    tags: ['science', 'water cycle', 'narrative-nonfiction', 'elementary'],
  },
  {
    id: '4',
    title: 'Paint a Picture With Words',
    mode: 'descriptive',
    grade: '3-5',
    difficulty: 'standard',
    subject: 'ELA',
    timeEstimate: 20,
    prompt: 'Choose one place you know very well — your bedroom, a park, your grandmother\'s kitchen. Describe it in such vivid detail that a reader who has never been there can see, hear, smell, and feel exactly what it\'s like. Use all five senses in your writing.',
    scaffoldQuestions: [
      'What does this place look like? Describe colors, shapes, sizes.',
      'What sounds do you hear there?',
      'Are there any smells? Textures you can touch?',
      'What feeling does this place give you?',
    ],
    rubricFocus: ['Sensory details', 'Specific word choice', 'Organization', 'Imagery', 'Coherence'],
    starred: false,
    usageCount: 55,
    tags: ['descriptive', 'sensory', 'place', 'vivid writing'],
  },
  {
    id: '5',
    title: 'Invent a New Planet',
    mode: 'creative',
    grade: 'K-2',
    difficulty: 'open-ended',
    subject: 'Science',
    timeEstimate: 25,
    prompt: 'Imagine you have discovered a brand-new planet! Draw a picture of it and write about what makes it special. What is the weather like? What creatures live there? What do the plants look like? Would you want to visit? Why or why not?',
    scaffoldQuestions: [
      'What is the name of your planet?',
      'What color is it? How big is it?',
      'What kinds of animals live there?',
      'Would you want to live there?',
    ],
    rubricFocus: ['Creativity', 'Description', 'Sentence structure', 'Effort', 'Details'],
    starred: true,
    usageCount: 112,
    tags: ['creative', 'space', 'primary', 'drawing + writing'],
  },
  {
    id: '6',
    title: 'What I Learned About Myself',
    mode: 'reflective',
    grade: '6-8',
    difficulty: 'standard',
    subject: 'ELA',
    timeEstimate: 30,
    prompt: 'Reflect on a challenge you faced this year — academic, personal, or social. Describe the situation honestly, explain what you tried, what worked and what didn\'t, and what you now understand about yourself that you didn\'t before. This is a private reflection — be as honest as you can.',
    scaffoldQuestions: [
      'What was the challenge? Set the scene.',
      'What did you try first? Did it work?',
      'What was the hardest part?',
      'What did you learn — about the topic AND about yourself?',
    ],
    rubricFocus: ['Honesty/authenticity', 'Specificity', 'Growth mindset', 'Voice', 'Reflection depth'],
    starred: false,
    usageCount: 28,
    tags: ['SEL', 'growth mindset', 'reflection', 'metacognition'],
  },
  {
    id: '7',
    title: 'Evaluate a Historical Decision',
    mode: 'research',
    grade: '9-12',
    difficulty: 'advanced',
    subject: 'Social Studies',
    timeEstimate: 90,
    prompt: 'Select one major historical decision — a political choice, a military action, or a social policy — and write a research-based analysis evaluating whether it was "the right call." Consider the context leaders faced, competing perspectives at the time, short-term outcomes, and long-term consequences. Avoid presentism: judge the decision fairly given what was known then.',
    scaffoldQuestions: [
      'What was the decision and who made it? When and why?',
      'What pressures or information did decision-makers have at the time?',
      'What were the immediate outcomes?',
      'How did history unfold differently because of this decision?',
      'Overall — good decision, bad decision, or somewhere in between?',
    ],
    rubricFocus: ['Historical accuracy', 'Evidence use', 'Multiple perspectives', 'Analytical reasoning', 'Citation format'],
    starred: true,
    usageCount: 19,
    tags: ['history', 'analysis', 'critical thinking', 'research'],
  },
  {
    id: '8',
    title: 'A Letter to My Future Self',
    mode: 'reflective',
    grade: 'K-2',
    difficulty: 'scaffolded',
    subject: 'ELA',
    timeEstimate: 20,
    prompt: 'Write a letter to yourself that you will open in 5 years. Tell your future self what you love about school right now, what you are working hard at, what you hope to be when you grow up, and one piece of advice you want to remember. Remember to start with "Dear Future Me,"',
    scaffoldQuestions: [
      'What do you love doing in school?',
      'What is something you are getting better at?',
      'What do you want to be when you grow up?',
      'What is one piece of advice for your older self?',
    ],
    rubricFocus: ['Letter format', 'Personal voice', 'Complete sentences', 'Details', 'Effort'],
    starred: false,
    usageCount: 73,
    tags: ['letter writing', 'future', 'primary', 'SEL'],
  },
]

const gradeRanges: GradeRange[] = ['K-2', '3-5', '6-8', '9-12', 'College']
const modes: PromptMode[] = ['narrative', 'persuasive', 'expository', 'descriptive', 'creative', 'reflective', 'research']

export default function WritingPromptsPage() {
  const [prompts, setPrompts] = useState<WritingPrompt[]>(PROMPTS)
  const [selectedMode, setSelectedMode] = useState<PromptMode | 'all'>('all')
  const [selectedGrade, setSelectedGrade] = useState<GradeRange | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>('1')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'library' | 'create'>('library')
  const [genMode, setGenMode] = useState<PromptMode>('narrative')
  const [genGrade, setGenGrade] = useState('6th-8th Grade')
  const [genTopic, setGenTopic] = useState('')
  const [genDiff, setGenDiff] = useState<DifficultyLevel>('standard')
  const [genInstructions, setGenInstructions] = useState('')
  const [genScaffold, setGenScaffold] = useState(false)
  const [genRubric, setGenRubric] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState('')

  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  function handleGeneratePrompt() {
    if (!genTopic.trim()) { showToast('Please enter a subject or topic'); return }
    setGenerating(true)
    setGeneratedText('')
    setTimeout(() => {
      const modeCfg = modeConfig[genMode]
      const scaffold = genScaffold ? '\n\nScaffolding Questions:\n1. What is your central idea or argument?\n2. What evidence or examples will you use?\n3. How will you begin your response?' : ''
      const rubric = genRubric ? '\n\nRubric Focus Areas: Organization · Voice · Word Choice · Conventions' : ''
      const starters: Record<PromptMode, string> = {
        narrative:   `Write a story about ${genTopic}`,
        persuasive:  `Write a persuasive essay arguing a position on ${genTopic}`,
        expository:  `Write an expository essay explaining ${genTopic}`,
        descriptive: `Write a descriptive piece about ${genTopic}`,
        creative:    `Write a creative piece inspired by ${genTopic}`,
        reflective:  `Write a personal reflection on ${genTopic}`,
        research:    `Write a research-based response on ${genTopic}`,
      }
      const text = `${modeCfg.label} Writing Prompt — ${genGrade}\n\nTopic: ${genTopic}\nDifficulty: ${difficultyConfig[genDiff].label}\n\n${genInstructions ? `Context: ${genInstructions}\n\n` : ''}Prompt:\n${starters[genMode]}. Use specific details and ${genMode === 'persuasive' ? 'strong evidence to support your claim' : genMode === 'narrative' ? 'vivid sensory language to bring your story to life' : 'clear organization to guide your reader'}. Your response should be ${genDiff === 'scaffolded' ? 'at least 2 paragraphs' : genDiff === 'advanced' ? 'at least 5 paragraphs with a clear thesis' : '3–4 paragraphs'}.${scaffold}${rubric}`
      setGeneratedText(text)
      setGenerating(false)
      showToast('Writing prompt generated!')
    }, 2200)
  }

  const filtered = prompts.filter(p => {
    if (selectedMode !== 'all' && p.mode !== selectedMode) return false
    if (selectedGrade !== 'all' && p.grade !== selectedGrade) return false
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false
    if (showStarredOnly && !p.starred) return false
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.prompt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  function toggleStar(id: string) {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p))
  }

  function copyPrompt(id: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function simulateRegenerate(id: string) {
    setGeneratingId(id)
    setTimeout(() => setGeneratingId(null), 1800)
  }

  const statCards = [
    { label: 'Total Prompts',   value: prompts.length,                    icon: FileText,   color: '#6366f1' },
    { label: 'AI Generated',    value: 24,                                icon: Sparkles,   color: '#8b5cf6' },
    { label: 'Student Favorites', value: prompts.filter(p => p.starred).length, icon: Heart, color: '#ec4899' },
    { label: 'Avg. Time',       value: `${Math.round(prompts.reduce((s, p) => s + p.timeEstimate, 0) / prompts.length)} min`, icon: Clock, color: '#14b8a6' },
  ]

  return (
    <div className="min-h-screen p-6 space-y-6">
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
            <CheckCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="text-sm font-medium text-white">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Pencil className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">Writing Prompts</h1>
                  <span className="text-xs font-bold bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full">AI-Powered</span>
                </div>
                <p className="text-sm text-surface-400 mt-1">AI-powered prompts for every genre, grade, and learning goal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  showStarredOnly
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-white/[0.03] border-white/[0.08] text-surface-400 hover:text-surface-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                Starred
              </button>
              <button
                onClick={() => { simulateRegenerate('batch'); showToast('New prompts generated!') }}
                className="btn-secondary text-xs px-3 py-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generatingId === 'batch' ? 'animate-spin' : ''}`} />
                Generate New
              </button>
              <button
                onClick={() => { setActiveTab('create'); showToast('Create your own prompt!') }}
                className="btn-primary text-xs px-4 py-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Prompt
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Total Prompts</span>
              <span className="text-xs font-bold text-white">{prompts.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Filtered</span>
              <span className="text-xs font-bold text-pink-400">{filtered.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">AI Generated</span>
              <span className="text-xs font-bold text-violet-400">24</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Starred</span>
              <span className="text-xs font-bold text-yellow-400">{prompts.filter(p => p.starred).length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-surface-400">Mode</span>
              <span className="text-xs font-bold text-surface-300 capitalize">{selectedMode === 'all' ? 'All' : selectedMode}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StaggerItem key={card.label}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${card.color}20` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-surface-400">{card.label}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Writing Mode Distribution Chart */}
      <FadeUp delay={0.08}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-400" /> Prompts by Writing Mode
            </h3>
            <span className="text-[10px] text-surface-500">{prompts.length} total</span>
          </div>
          {(() => {
            const items = modes.map(m => ({ ...modeConfig[m], count: prompts.filter(p => p.mode === m).length, mode: m }))
            const maxC = Math.max(...items.map(x => x.count), 1)
            const W = 560, ROW = 18, GAP = 4, LW = 80, CW = 20, BAR_MAX = W - LW - CW - 8
            const H = items.length * (ROW + GAP)
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                <defs>
                  {items.map((x, i) => (
                    <linearGradient key={i} id={`wp-mode-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={x.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={x.color} stopOpacity="0.35" />
                    </linearGradient>
                  ))}
                </defs>
                {items.map((x, i) => {
                  const y = i * (ROW + GAP)
                  const bw = (x.count / maxC) * BAR_MAX
                  return (
                    <g key={x.mode}>
                      <text x={LW - 4} y={y + ROW - 4} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize="10">{x.label}</text>
                      <rect x={LW} y={y + 2} width={BAR_MAX} height={ROW - 5} rx="3" fill="rgba(255,255,255,0.04)" />
                      <motion.rect x={LW} y={y + 2} width={bw} height={ROW - 5} rx="3" fill={`url(#wp-mode-${i})`}
                        initial={{ width: 0 }} animate={{ width: bw }} transition={{ delay: 0.1 + i * 0.07, duration: 0.55, ease: 'easeOut' }} />
                      <text x={W} y={y + ROW - 4} textAnchor="end" fill={x.color} fontSize="10" fontWeight="700">{x.count}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
        </div>
      </FadeUp>

      {/* Tabs */}
      <FadeUp delay={0.1}>
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          {(['library', 'create'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              {tab === 'library' ? 'Prompt Library' : 'AI Create'}
            </button>
          ))}
        </div>
      </FadeUp>

      {activeTab === 'library' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <FadeUp delay={0.1} className="xl:col-span-1">
            <div className="glass-card p-4 space-y-5 sticky top-6">
              <h3 className="text-sm font-semibold text-surface-200">Filters</h3>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:border-accent-500/40"
                />
              </div>

              {/* Writing Mode */}
              <div>
                <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Writing Mode</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedMode('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedMode === 'all' ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                  >
                    All Modes
                  </button>
                  {modes.map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${selectedMode === mode ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                    >
                      <span>{modeConfig[mode].icon}</span>
                      {modeConfig[mode].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Range */}
              <div>
                <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Grade Range</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedGrade('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedGrade === 'all' ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                  >
                    All Grades
                  </button>
                  {gradeRanges.map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedGrade === g ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Difficulty</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedDifficulty === 'all' ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                  >
                    All Levels
                  </button>
                  {(['scaffolded', 'standard', 'advanced', 'open-ended'] as DifficultyLevel[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(d)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${selectedDifficulty === d ? 'bg-accent-500/20 text-accent-300' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: difficultyConfig[d].color }} />
                      {difficultyConfig[d].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Prompt Cards */}
          <div className="xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-surface-500">{filtered.length} prompt{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="flex items-center gap-1 text-xs text-surface-500">
                <Layers className="w-3.5 h-3.5" />
                <span>{filtered.reduce((s, p) => s + p.usageCount, 0)} total uses</span>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.map((prompt, i) => {
                const cfg = modeConfig[prompt.mode]
                const diff = difficultyConfig[prompt.difficulty]
                const isExpanded = expandedId === prompt.id
                const isGenerating = generatingId === prompt.id

                return (
                  <motion.div
                    key={prompt.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Card Header */}
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}30` }}
                      >
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-surface-100">{prompt.title}</h3>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${diff.color}20`, color: diff.color }}>
                            {diff.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-surface-400">Gr. {prompt.grade}</span>
                          <span className="text-[11px] text-surface-500">{prompt.subject}</span>
                          <span className="flex items-center gap-1 text-[11px] text-surface-500">
                            <Clock className="w-3 h-3" />
                            {prompt.timeEstimate} min
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-surface-500">
                            <Flame className="w-3 h-3 text-orange-400" />
                            {prompt.usageCount} uses
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); toggleStar(prompt.id) }}
                          className={`p-1.5 rounded-lg transition-colors ${prompt.starred ? 'text-yellow-400 bg-yellow-400/10' : 'text-surface-500 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
                        >
                          <Star className="w-4 h-4" fill={prompt.starred ? 'currentColor' : 'none'} />
                        </button>
                        <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4 border-t border-white/[0.06] pt-4">
                            {/* Prompt Text */}
                            <div className="relative rounded-xl p-4 border" style={{ background: `${cfg.color}08`, borderColor: `${cfg.color}20` }}>
                              {isGenerating && (
                                <div className="absolute inset-0 rounded-xl bg-surface-900/70 flex items-center justify-center z-10">
                                  <div className="flex items-center gap-2 text-xs text-surface-300">
                                    <Sparkles className="w-4 h-4 text-accent-400 animate-pulse" />
                                    AI regenerating prompt…
                                  </div>
                                </div>
                              )}
                              <p className="text-sm text-surface-200 leading-relaxed">{prompt.prompt}</p>
                            </div>

                            {/* Scaffold Questions */}
                            <div>
                              <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                                Scaffold Questions
                              </p>
                              <div className="space-y-1.5">
                                {prompt.scaffoldQuestions.map((q, qi) => (
                                  <div key={qi} className="flex items-start gap-2 text-xs text-surface-300">
                                    <span className="w-5 h-5 rounded-full bg-accent-500/15 text-accent-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                      {qi + 1}
                                    </span>
                                    {q}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Rubric Focus */}
                            <div>
                              <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-teal-400" />
                                Rubric Focus Areas
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {prompt.rubricFocus.map(area => (
                                  <span key={area} className="px-2 py-1 rounded-lg text-[11px] bg-white/[0.04] border border-white/[0.08] text-surface-300">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {prompt.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-surface-800/60 text-surface-500 border border-white/[0.06]">
                                  <Tag className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => copyPrompt(prompt.id, prompt.prompt)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  copiedId === prompt.id
                                    ? 'bg-success-500/20 border border-success-500/30 text-success-400'
                                    : 'bg-white/[0.04] border border-white/[0.08] text-surface-300 hover:text-white hover:bg-white/[0.07]'
                                }`}
                              >
                                {copiedId === prompt.id ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedId === prompt.id ? 'Copied!' : 'Copy Prompt'}
                              </button>
                              <button
                                onClick={() => simulateRegenerate(prompt.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-500/15 border border-accent-500/25 text-accent-300 hover:bg-accent-500/25 transition-all"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Variant
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.08] text-surface-400 hover:text-surface-200 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                Export
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.08] text-surface-400 hover:text-surface-200 transition-colors ml-auto">
                                <Share2 className="w-3.5 h-3.5" />
                                Share
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Pencil className="w-12 h-12 text-surface-600 mx-auto mb-3" />
                <p className="text-sm text-surface-400">No prompts match your filters</p>
                <button
                  onClick={() => { setSelectedMode('all'); setSelectedGrade('all'); setSelectedDifficulty('all'); setSearchQuery('') }}
                  className="mt-3 text-xs text-accent-400 hover:text-accent-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Create Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-accent-400" />
                  <h3 className="text-sm font-semibold text-surface-100">AI Prompt Generator</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-surface-400 mb-1.5">Writing Mode</label>
                    <select value={genMode} onChange={e => setGenMode(e.target.value as PromptMode)} className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-200 focus:outline-none focus:border-accent-500/40">
                      {modes.map(m => <option key={m} value={m}>{modeConfig[m].label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-surface-400 mb-1.5">Grade Range</label>
                    <select value={genGrade} onChange={e => setGenGrade(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-200 focus:outline-none focus:border-accent-500/40">
                      {gradeRanges.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-surface-400 mb-1.5">Subject / Topic</label>
                    <input
                      value={genTopic}
                      onChange={e => setGenTopic(e.target.value)}
                      placeholder="e.g. Climate change, Civil War, Poetry..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-surface-400 mb-1.5">Difficulty</label>
                    <select value={genDiff} onChange={e => setGenDiff(e.target.value as DifficultyLevel)} className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-200 focus:outline-none focus:border-accent-500/40">
                      {(['scaffolded', 'standard', 'advanced', 'open-ended'] as DifficultyLevel[]).map(d => (
                        <option key={d} value={d}>{difficultyConfig[d].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-surface-400 mb-1.5">Additional Instructions (optional)</label>
                  <textarea
                    rows={3}
                    value={genInstructions}
                    onChange={e => setGenInstructions(e.target.value)}
                    placeholder="Include vocabulary words, connect to a theme, align with a specific standard, etc."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-accent-500/40 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
                    <input type="checkbox" checked={genScaffold} onChange={e => setGenScaffold(e.target.checked)} className="rounded" />
                    Include scaffold questions
                  </label>
                  <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
                    <input type="checkbox" checked={genRubric} onChange={e => setGenRubric(e.target.checked)} className="rounded" />
                    Include rubric focus areas
                  </label>
                </div>

                <button onClick={handleGeneratePrompt} disabled={generating} className="btn-primary text-xs px-6 py-2.5 w-full justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {generating ? 'Generating…' : 'Generate Writing Prompt'}
                </button>
              </div>

              {/* Preview Area */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-surface-200">Generated Prompt Preview</h3>
                  {generating
                    ? <span className="px-2 py-0.5 rounded text-[10px] bg-accent-500/15 text-accent-400 border border-accent-500/20 animate-pulse">Generating…</span>
                    : generatedText
                    ? <span className="px-2 py-0.5 rounded text-[10px] bg-success-400/15 text-success-400 border border-success-400/20">Ready</span>
                    : <span className="px-2 py-0.5 rounded text-[10px] bg-surface-800 text-surface-500 border border-white/[0.06]">Waiting…</span>
                  }
                </div>
                {generatedText ? (
                  <div className="space-y-3">
                    <pre className="text-xs text-surface-200 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">{generatedText}</pre>
                    <div className="flex gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(generatedText); showToast('Prompt copied!') }} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">Copy</button>
                      <button onClick={() => setGeneratedText('')} className="btn-secondary text-xs px-3 py-1.5">Clear</button>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.08] flex items-center justify-center">
                    <div className="text-center">
                      <Pencil className="w-8 h-8 text-surface-700 mx-auto mb-2" />
                      <p className="text-xs text-surface-600">Your AI-generated prompt will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Writing Mode Guide
                </h3>
                <div className="space-y-3">
                  {modes.map(mode => {
                    const tips: Record<PromptMode, string> = {
                      narrative:   'Focuses on storytelling — plot, character, setting, and theme.',
                      persuasive:  'Argues a position with evidence, counterargument, and call to action.',
                      expository:  'Explains or informs clearly, factually, and logically.',
                      descriptive: 'Creates vivid mental images through sensory language and detail.',
                      creative:    'Encourages imagination and original expression, no fixed form.',
                      reflective:  'Promotes metacognition — thinking about thinking and learning.',
                      research:    'Synthesizes multiple sources into an original analytical piece.',
                    }
                    return (
                      <div key={mode} className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0 mt-0.5">{modeConfig[mode].icon}</span>
                        <div>
                          <p className="text-xs font-medium" style={{ color: modeConfig[mode].color }}>{modeConfig[mode].label}</p>
                          <p className="text-[11px] text-surface-500 leading-relaxed">{tips[mode]}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Most Used', value: 'K-2 Creative', sub: '112 uses' },
                    { label: 'Top Subject', value: 'ELA', sub: '5 prompts' },
                    { label: 'Avg. Difficulty', value: 'Standard', sub: 'across all prompts' },
                    { label: 'Total Time Saved', value: '~12 hrs', sub: 'estimated' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-surface-500">{stat.label}</span>
                      <div className="text-right">
                        <p className="text-xs font-medium text-surface-200">{stat.value}</p>
                        <p className="text-[10px] text-surface-600">{stat.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
