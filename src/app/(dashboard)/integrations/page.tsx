'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plug, Search, Check, Globe, ChevronRight, Zap, ExternalLink,
  BookOpen, MessageSquare, HardDrive, BarChart2, ClipboardCheck,
  RefreshCw, Clock, CheckCircle2, AlertCircle, ChevronDown,
  Sparkles, Shield, Link2, Send, Plus, X, ArrowRight,
  GraduationCap, Video, FileText, Database, Activity, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type IntegrationStatus = 'connected' | 'not_connected' | 'coming_soon'
type SyncStatus = 'synced' | 'syncing'
type Category = 'All' | 'LMS' | 'Communication' | 'Storage' | 'Analytics' | 'Assessment'

interface Integration {
  id: string
  name: string
  category: Exclude<Category, 'All'>
  description: string
  status: IntegrationStatus
  color: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  syncStatus?: SyncStatus
  lastSynced?: string
  features: string[]
  setupSteps: string[]
}

const integrations: Integration[] = [
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    category: 'LMS',
    description: 'Sync classes, assignments, and grades automatically with Google Classroom. Streamline your workflow with bi-directional data sync.',
    status: 'connected',
    color: '#4285f4',
    icon: GraduationCap,
    syncStatus: 'synced',
    lastSynced: '2 min ago',
    features: [
      'Automatic class roster syncing',
      'Assignment push and grade pull',
      'Real-time notification forwarding',
      'Bulk student import and export',
    ],
    setupSteps: [
      'Sign in with your Google account',
      'Select the classes to sync',
      'Configure sync frequency and permissions',
      'Verify connection and run first sync',
    ],
  },
  {
    id: 'canvas-lms',
    name: 'Canvas LMS',
    category: 'LMS',
    description: 'Connect your Canvas courses for seamless content and grade syncing. Full LTI integration with deep linking support.',
    status: 'connected',
    color: '#e74c3c',
    icon: BookOpen,
    syncStatus: 'syncing',
    lastSynced: '5 min ago',
    features: [
      'LTI 1.3 deep linking integration',
      'Gradebook bi-directional sync',
      'Course content auto-publish',
      'SpeedGrader compatibility',
    ],
    setupSteps: [
      'Navigate to Canvas Admin settings',
      'Add TALEEKO as an external app',
      'Paste the provided API key',
      'Map courses and enable sync',
    ],
  },
  {
    id: 'powerSchool',
    name: 'PowerSchool',
    category: 'LMS',
    description: 'Import student data and sync gradebooks with PowerSchool SIS. Enterprise-grade integration for district-wide deployment.',
    status: 'not_connected',
    color: '#2ecc71',
    icon: Database,
    features: [
      'Student Information System sync',
      'Attendance data integration',
      'Parent portal notifications',
      'District-wide rostering',
    ],
    setupSteps: [
      'Request API access from your district',
      'Enter your PowerSchool plugin credentials',
      'Map data fields to TALEEKO',
      'Test with a single school before rollout',
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Send notifications and updates directly to your Slack workspace. Keep your team informed with automated alerts.',
    status: 'connected',
    color: '#e91e8b',
    icon: MessageSquare,
    syncStatus: 'synced',
    lastSynced: '1 min ago',
    features: [
      'Channel-based notifications',
      'Direct message alerts for deadlines',
      'Slash command integration',
      'Custom notification rules',
    ],
    setupSteps: [
      'Install the TALEEKO Slack app',
      'Authorize workspace access',
      'Choose notification channels',
      'Set alert preferences and schedules',
    ],
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Automate email communications with students and parents. Smart templates and scheduled delivery built in.',
    status: 'not_connected',
    color: '#ea4335',
    icon: Send,
    features: [
      'Automated parent updates',
      'Smart email templates',
      'Scheduled delivery windows',
      'Read receipt tracking',
    ],
    setupSteps: [
      'Connect your Google account',
      'Grant email send permissions',
      'Import your contact lists',
      'Set up email templates',
    ],
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Storage',
    description: 'Store and access lesson materials directly from Google Drive. Organize your teaching resources in the cloud.',
    status: 'connected',
    color: '#fbbc05',
    icon: HardDrive,
    syncStatus: 'synced',
    lastSynced: '8 min ago',
    features: [
      'Direct file attachment from Drive',
      'Automatic backup of materials',
      'Shared folder collaboration',
      'Version history tracking',
    ],
    setupSteps: [
      'Sign in with Google',
      'Select folders to sync',
      'Set sharing permissions',
      'Enable automatic backup',
    ],
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    category: 'Storage',
    description: 'Connect Microsoft OneDrive for cloud file storage and sharing. Perfect for Microsoft 365 school environments.',
    status: 'not_connected',
    color: '#0078d4',
    icon: HardDrive,
    features: [
      'Microsoft 365 file integration',
      'SharePoint library access',
      'Co-authoring support',
      'Automatic version control',
    ],
    setupSteps: [
      'Sign in with Microsoft account',
      'Select OneDrive folders',
      'Configure sync preferences',
      'Set up file type filters',
    ],
  },
  {
    id: 'ms-teams',
    name: 'Microsoft Teams',
    category: 'Communication',
    description: 'Integrate with Teams for video calls and collaboration channels. Embed TALEEKO directly in your Teams workflow.',
    status: 'not_connected',
    color: '#6264a7',
    icon: Video,
    features: [
      'Teams tab integration',
      'Meeting scheduling and links',
      'Channel notifications',
      'Bot-assisted commands',
    ],
    setupSteps: [
      'Install from Teams App Store',
      'Authorize organization access',
      'Add TALEEKO tabs to channels',
      'Configure bot permissions',
    ],
  },
  {
    id: 'clever',
    name: 'Clever',
    category: 'LMS',
    description: 'Single sign-on and automatic rostering through Clever. Simplify login for every student and teacher.',
    status: 'coming_soon',
    color: '#4c8bf5',
    icon: Link2,
    features: [
      'Single sign-on for all users',
      'Automatic roster syncing',
      'Secure data sharing',
      'District dashboard access',
    ],
    setupSteps: [
      'Contact your Clever district admin',
      'Approve TALEEKO in Clever portal',
      'Map student and teacher records',
      'Enable SSO for your organization',
    ],
  },
  {
    id: 'schoology',
    name: 'Schoology',
    category: 'LMS',
    description: 'Sync coursework and analytics with the Schoology platform. Deep integration with learning analytics.',
    status: 'coming_soon',
    color: '#009fd4',
    icon: GraduationCap,
    features: [
      'Course material sync',
      'Analytics dashboard integration',
      'Assignment workflow automation',
      'Parent engagement tools',
    ],
    setupSteps: [
      'Enable API access in Schoology',
      'Generate integration credentials',
      'Connect and map courses',
      'Activate analytics sync',
    ],
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    category: 'Assessment',
    description: 'Assign practice exercises and track mastery on Khan Academy. Leverage world-class practice content.',
    status: 'coming_soon',
    color: '#14bf96',
    icon: ClipboardCheck,
    features: [
      'Mastery-based assignment creation',
      'Progress tracking and reports',
      'Skill gap identification',
      'Personalized practice paths',
    ],
    setupSteps: [
      'Link your Khan Academy teacher account',
      'Import class rosters',
      'Assign content areas',
      'Enable progress tracking',
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Storage',
    description: 'Organize lesson plans and resources in your Notion workspace. Export and import with structured templates.',
    status: 'coming_soon',
    color: '#000000',
    icon: FileText,
    features: [
      'Lesson plan export to Notion',
      'Template syncing',
      'Database integration',
      'Collaborative workspace linking',
    ],
    setupSteps: [
      'Connect your Notion workspace',
      'Select pages and databases',
      'Map content structure',
      'Enable bi-directional sync',
    ],
  },
]

const categoryTabs: { key: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'All', label: 'All', icon: Sparkles },
  { key: 'LMS', label: 'LMS', icon: GraduationCap },
  { key: 'Communication', label: 'Communication', icon: MessageSquare },
  { key: 'Storage', label: 'Storage', icon: HardDrive },
  { key: 'Analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'Assessment', label: 'Assessment', icon: ClipboardCheck },
]

const stats = [
  { label: 'Available', value: '12', icon: Plug, color: '#8b5cf6' },
  { label: 'Connected', value: '4', icon: CheckCircle2, color: '#10b981' },
  { label: 'Pending', value: '2', icon: Clock, color: '#f59e0b' },
  { label: 'Uptime', value: '98%', icon: Activity, color: '#06b6d4' },
]

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500) }

  const connectedIntegrations = integrations.filter(i => i.status === 'connected')

  const filtered = useMemo(() => {
    return integrations.filter(i => {
      const matchesSearch = !search.trim() ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false
      if (activeTab === 'All') return true
      return i.category === activeTab
    })
  }, [search, activeTab])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>
                <Plug className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Integrations</h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">Connected</span>
                </div>
                <p className="text-sm text-surface-400">Connect your favorite tools and platforms</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button className="btn-secondary text-xs px-3 py-1.5" whileHover={{ scale: 1.03 }} onClick={() => showToast('All integrations synced!')}>
                <RefreshCw className="w-3.5 h-3.5" /> Sync All
              </motion.button>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} onClick={() => showToast('Opening marketplace…')}>
                <Sparkles className="w-3.5 h-3.5" /> Browse Marketplace
              </motion.button>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Available</span>
              <span className="text-xs font-bold text-white">{integrations.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Connected</span>
              <span className="text-xs font-bold text-success-400">{connectedIntegrations.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Filtered</span>
              <span className="text-xs font-bold text-white">{filtered.length}</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Uptime</span>
              <span className="text-xs font-bold text-indigo-400">98%</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">Category</span>
              <span className="text-xs font-bold text-white">{activeTab}</span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}18` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-white leading-tight">{stat.value}</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Category Breakdown Chart */}
      <FadeUp delay={0.07}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-accent-400" /> Integrations by Category
            </h3>
            <span className="text-[10px] text-surface-500">{integrations.length} total</span>
          </div>
          {(() => {
            const cats: Exclude<Category, 'All'>[] = ['LMS', 'Communication', 'Storage', 'Analytics', 'Assessment']
            const catColors: Record<string, string> = { LMS: '#6366f1', Communication: '#10b981', Storage: '#f59e0b', Analytics: '#22d3ee', Assessment: '#ec4899' }
            const counts = cats.map(c => ({
              label: c, color: catColors[c],
              total: integrations.filter(i => i.category === c).length,
              connected: integrations.filter(i => i.category === c && i.status === 'connected').length,
            }))
            const maxC = Math.max(...counts.map(x => x.total), 1)
            const W = 560, ROW = 18, GAP = 5, LW = 90, CW = 24, BAR_MAX = W - LW - CW - 8
            const H = counts.length * (ROW + GAP)
            return (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                <defs>
                  {counts.map((x, i) => (
                    <linearGradient key={i} id={`int-cat-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={x.color} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={x.color} stopOpacity="0.35" />
                    </linearGradient>
                  ))}
                </defs>
                {counts.map((x, i) => {
                  const y = i * (ROW + GAP)
                  const bwTotal = (x.total / maxC) * BAR_MAX
                  const bwConn = (x.connected / maxC) * BAR_MAX
                  return (
                    <g key={x.label}>
                      <text x={LW - 4} y={y + ROW - 4} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize="10">{x.label}</text>
                      <rect x={LW} y={y + 2} width={BAR_MAX} height={ROW - 5} rx="3" fill="rgba(255,255,255,0.04)" />
                      <motion.rect x={LW} y={y + 2} width={bwTotal} height={ROW - 5} rx="3" fill={`url(#int-cat-${i})`}
                        initial={{ width: 0 }} animate={{ width: bwTotal }} transition={{ delay: 0.1 + i * 0.07, duration: 0.55, ease: 'easeOut' }} />
                      <motion.rect x={LW} y={y + 2} width={bwConn} height={ROW - 5} rx="3" fill={x.color}
                        initial={{ width: 0 }} animate={{ width: bwConn }} transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease: 'easeOut' }} />
                      <text x={W} y={y + ROW - 4} textAnchor="end" fill={x.color} fontSize="10" fontWeight="700">{x.connected}/{x.total}</text>
                    </g>
                  )
                })}
              </svg>
            )
          })()}
          <div className="flex items-center gap-4 mt-3 text-[10px] text-surface-500">
            <span className="flex items-center gap-1.5"><span className="w-8 h-1.5 rounded-full bg-white/20 inline-block" />Total available</span>
            <span className="flex items-center gap-1.5"><span className="w-8 h-1.5 rounded-full bg-accent-400 inline-block" />Connected</span>
          </div>
        </div>
      </FadeUp>

      {/* Connected Integrations Summary */}
      <FadeUp delay={0.08}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Connected Integrations</h3>
            <span className="text-[10px] text-surface-500 uppercase tracking-wider">{connectedIntegrations.length} active</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {connectedIntegrations.map((integration, i) => (
              <motion.div
                key={integration.id}
                className="glass-card p-3 cursor-pointer group"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => setExpandedId(expandedId === integration.id ? null : integration.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${integration.color}18` }}
                  >
                    <integration.icon className="w-4 h-4" style={{ color: integration.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-accent-300 transition-colors">
                      {integration.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          integration.syncStatus === 'synced'
                            ? 'bg-success-400'
                            : 'bg-warning-400 animate-pulse'
                        }`}
                      />
                      <span className="text-[10px] text-surface-500 truncate">
                        {integration.syncStatus === 'syncing' ? 'Syncing...' : integration.lastSynced}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Search & Category Filter */}
      <FadeUp delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoryTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Integration Cards Grid */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.08}>
        <AnimatePresence mode="popLayout">
          {filtered.map(integration => {
            const isExpanded = expandedId === integration.id
            return (
              <StaggerItem key={integration.id} variants={fadeUp} layout>
                <motion.div
                  className="glass-card overflow-hidden h-full flex flex-col"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  layout
                >
                  {/* Color accent bar */}
                  <div className="h-1" style={{ backgroundColor: integration.color }} />

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <motion.div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${integration.color}18` }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <integration.icon className="w-5 h-5" style={{ color: integration.color }} />
                        </motion.div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{integration.name}</h3>
                          <span className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">
                            {integration.category}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0 ml-2">
                        {integration.status === 'connected' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-400/10 border border-success-400/20">
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                integration.syncStatus === 'synced'
                                  ? 'bg-success-400'
                                  : 'bg-warning-400 animate-pulse'
                              }`}
                            />
                            <span className={`text-[10px] font-semibold ${
                              integration.syncStatus === 'synced' ? 'text-success-400' : 'text-warning-400'
                            }`}>
                              {integration.syncStatus === 'syncing' ? 'Syncing' : 'Connected'}
                            </span>
                          </span>
                        )}
                        {integration.status === 'not_connected' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                            <span className="w-1.5 h-1.5 rounded-full bg-surface-500" />
                            <span className="text-[10px] font-semibold text-surface-500">Offline</span>
                          </span>
                        )}
                        {integration.status === 'coming_soon' && (
                          <span className="badge bg-warning-400/15 text-warning-400">Coming Soon</span>
                        )}
                      </div>
                    </div>

                    {/* Last synced for connected */}
                    {integration.status === 'connected' && integration.lastSynced && (
                      <div className="flex items-center gap-1.5 mb-3 text-[10px] text-surface-500">
                        <Clock className="w-3 h-3" />
                        <span>Last synced {integration.lastSynced}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-surface-400 leading-relaxed mb-4 flex-1">
                      {integration.description}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {integration.status === 'connected' && (
                        <>
                          <motion.button
                            className="btn-secondary text-xs px-3 py-1.5 flex-1 flex items-center justify-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Sync
                          </motion.button>
                          <motion.button
                            className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-surface-400 hover:text-white hover:border-white/[0.12] transition-all flex items-center justify-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedId(isExpanded ? null : integration.id)
                            }}
                          >
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            Details
                          </motion.button>
                        </>
                      )}
                      {integration.status === 'not_connected' && (
                        <>
                          <motion.button
                            className="btn-primary text-xs px-3 py-1.5 flex-1 flex items-center justify-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Zap className="w-3 h-3" />
                            Connect
                          </motion.button>
                          <motion.button
                            className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-surface-400 hover:text-white hover:border-white/[0.12] transition-all flex items-center justify-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedId(isExpanded ? null : integration.id)
                            }}
                          >
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            Details
                          </motion.button>
                        </>
                      )}
                      {integration.status === 'coming_soon' && (
                        <button
                          className="text-xs px-4 py-1.5 w-full rounded-xl bg-white/[0.03] border border-white/[0.06] text-surface-500 cursor-not-allowed flex items-center justify-center gap-1.5"
                          disabled
                        >
                          <Clock className="w-3 h-3" />
                          Notify Me
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Detail Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/[0.06]">
                          {/* Features */}
                          <div className="mt-4 mb-4">
                            <h4 className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-2">
                              Key Features
                            </h4>
                            <ul className="space-y-1.5">
                              {integration.features.map((feature, fi) => (
                                <motion.li
                                  key={fi}
                                  className="flex items-start gap-2 text-xs text-surface-300"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.05 + fi * 0.04 }}
                                >
                                  <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: integration.color }} />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {/* Setup Steps */}
                          <div className="mb-4">
                            <h4 className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold mb-2">
                              Setup Steps
                            </h4>
                            <ol className="space-y-1.5">
                              {integration.setupSteps.map((step, si) => (
                                <motion.li
                                  key={si}
                                  className="flex items-start gap-2 text-xs text-surface-400"
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.15 + si * 0.04 }}
                                >
                                  <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5"
                                    style={{ backgroundColor: `${integration.color}18`, color: integration.color }}
                                  >
                                    {si + 1}
                                  </span>
                                  {step}
                                </motion.li>
                              ))}
                            </ol>
                          </div>

                          {/* Connect / Disconnect button */}
                          {integration.status === 'connected' ? (
                            <motion.button
                              className="w-full text-xs px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5 font-semibold"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <X className="w-3 h-3" />
                              Disconnect Integration
                            </motion.button>
                          ) : integration.status === 'not_connected' ? (
                            <motion.button
                              className="btn-gradient text-xs px-4 py-2 w-full flex items-center justify-center gap-1.5"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Zap className="w-3 h-3" />
                              Start Setup
                              <ArrowRight className="w-3 h-3" />
                            </motion.button>
                          ) : null}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </StaggerItem>
            )
          })}
        </AnimatePresence>
      </StaggerList>

      {/* Empty State */}
      {filtered.length === 0 && (
        <FadeUp delay={0.1}>
          <div className="glass-card p-12 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/[0.04]">
              <Search className="w-7 h-7 text-surface-500" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No integrations found</h3>
            <p className="text-sm text-surface-400 mb-4">
              No integrations match your current filters.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveTab('All') }}
              className="text-xs text-accent-400 hover:text-accent-300 font-semibold transition-colors"
            >
              Clear filters
            </button>
          </div>
        </FadeUp>
      )}

      {/* Request Integration CTA */}
      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card overflow-hidden">
          <div className="relative p-6">
            {/* Background gradient accent */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: 'radial-gradient(ellipse at top right, #6366f1, transparent 60%), radial-gradient(ellipse at bottom left, #22d3ee, transparent 60%)',
              }}
            />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,238,0.15))' }}
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Globe className="w-6 h-6 text-accent-400" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">Request an Integration</h3>
                  <p className="text-xs text-surface-400 leading-relaxed max-w-md">
                    Don&apos;t see the tool you need? Submit a request and our team will evaluate adding it to the platform.
                    Popular requests get prioritized.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  className="btn-gradient text-xs px-5 py-2 flex items-center gap-1.5"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Request Integration
                </motion.button>
                <motion.button
                  className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Roadmap
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
