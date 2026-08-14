'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key, Copy, Trash2, Plus, ExternalLink, Eye, EyeOff, Check, Shield,
  Globe, Activity, Clock, AlertTriangle, ChevronRight, X, Lock, Zap,
  RefreshCw, Settings, Search, Filter, Download, ChevronDown,
  Users, Terminal, Bell, FileText, BarChart2, Server, Wifi, CheckCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type KeyStatus = 'active' | 'revoked'
type WebhookStatus = 'active' | 'inactive'
type LogLevel = 'success' | 'error' | 'warning'

interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  created: string
  lastUsed: string
  status: KeyStatus
  permissions: string[]
  requests: number
  environment: 'production' | 'development'
}

interface Webhook {
  id: string
  url: string
  events: string[]
  status: WebhookStatus
  deliveries: number
  lastDelivery: string
}

interface LogEntry {
  id: string
  method: string
  endpoint: string
  status: number
  time: string
  duration: string
  keyName: string
}

interface OAuthApp {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  connected: boolean
  scope: string
}

const apiKeys: ApiKey[] = [
  {
    id: '1', name: 'Production API Key',
    key: 'sk-prod-a8f3b2c1d9e7f4a6b8c2d1e9f7a3b5c8',
    maskedKey: 'sk-prod-...b5c8',
    created: 'Jan 15, 2026', lastUsed: '2 hours ago', status: 'active',
    permissions: ['read:students', 'write:assignments', 'read:grades', 'write:reports'],
    requests: 18420, environment: 'production'
  },
  {
    id: '2', name: 'Development Key',
    key: 'sk-dev-x7y2z9w4v6u8t3s1r5q7p2o9n4m6l8k3',
    maskedKey: 'sk-dev-...l8k3',
    created: 'Mar 8, 2026', lastUsed: '5 days ago', status: 'active',
    permissions: ['read:students', 'read:assignments', 'read:grades'],
    requests: 4210, environment: 'development'
  },
  {
    id: '3', name: 'CI/CD Pipeline Key',
    key: 'sk-ci-p9q2r7s1t4u8v3w6x2y9z1a5b8c3d7e4',
    maskedKey: 'sk-ci-...d7e4',
    created: 'May 1, 2026', lastUsed: '1 day ago', status: 'active',
    permissions: ['read:reports', 'write:reports'],
    requests: 892, environment: 'production'
  },
  {
    id: '4', name: 'Legacy Integration',
    key: 'sk-old-j3k8l2m7n1o6p4q9r5s2t8u3v7w1x6y4',
    maskedKey: 'sk-old-...x6y4',
    created: 'Sep 22, 2025', lastUsed: 'Dec 1, 2025', status: 'revoked',
    permissions: ['read:students'],
    requests: 22091, environment: 'production'
  },
]

const webhooks: Webhook[] = [
  { id: '1', url: 'https://api.school.edu/webhooks/taleeko', events: ['assignment.created', 'grade.updated', 'student.enrolled'], status: 'active', deliveries: 1284, lastDelivery: '5 min ago' },
  { id: '2', url: 'https://hooks.slack.com/services/T0X/B0Y/abc123', events: ['notification.sent', 'report.generated'], status: 'active', deliveries: 489, lastDelivery: '2 hours ago' },
  { id: '3', url: 'https://myschool.edu/api/sis-sync', events: ['student.grade_changed', 'student.enrolled'], status: 'inactive', deliveries: 32, lastDelivery: 'Jul 1, 2026' },
]

const usageData = [
  { day: 'Mon', calls: 1240 },
  { day: 'Tue', calls: 1890 },
  { day: 'Wed', calls: 2150 },
  { day: 'Thu', calls: 1680 },
  { day: 'Fri', calls: 2400 },
  { day: 'Sat', calls: 820 },
  { day: 'Sun', calls: 540 },
]

const recentLogs: LogEntry[] = [
  { id: '1', method: 'GET',  endpoint: '/v1/students',        status: 200, time: '2 min ago',  duration: '98ms',  keyName: 'Production API Key' },
  { id: '2', method: 'POST', endpoint: '/v1/assignments',     status: 201, time: '5 min ago',  duration: '142ms', keyName: 'Production API Key' },
  { id: '3', method: 'GET',  endpoint: '/v1/grades/class/7s', status: 200, time: '12 min ago', duration: '76ms',  keyName: 'Development Key' },
  { id: '4', method: 'POST', endpoint: '/v1/reports/generate',status: 429, time: '15 min ago', duration: '12ms',  keyName: 'Production API Key' },
  { id: '5', method: 'GET',  endpoint: '/v1/curriculum',      status: 200, time: '1 hour ago', duration: '88ms',  keyName: 'CI/CD Pipeline Key' },
]

const oauthApps: OAuthApp[] = [
  { id: '1', name: 'Google Classroom', icon: Globe, color: '#4285F4', connected: true, scope: 'Classes, assignments, roster sync' },
  { id: '2', name: 'Canvas LMS', icon: Server, color: '#e66000', connected: true, scope: 'Grades, assignments, courses' },
  { id: '3', name: 'PowerSchool SIS', icon: Users, color: '#00739d', connected: false, scope: 'Student records, attendance' },
  { id: '4', name: 'Remind', icon: Bell, color: '#0084ff', connected: false, scope: 'Parent messaging, notifications' },
]

const maxCalls = Math.max(...usageData.map(d => d.calls))

export default function ApiKeysPage() {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [createModal, setCreateModal] = useState(false)
  const [activeSection, setActiveSection] = useState<'keys' | 'webhooks' | 'logs' | 'oauth'>('keys')
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'development'>('development')
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['read:students'])
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  const totalCalls = usageData.reduce((sum, d) => sum + d.calls, 0)

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('API key copied to clipboard')
  }

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])
  }

  const allPerms = ['read:students', 'write:students', 'read:assignments', 'write:assignments', 'read:grades', 'write:grades', 'read:reports', 'write:reports', 'admin:all']

  const logLevelColors: Record<number, LogLevel> = {}
  recentLogs.forEach(l => { logLevelColors[l.status] = l.status < 300 ? 'success' : l.status === 429 ? 'warning' : 'error' })

  const statusColor = (code: number) => code < 300 ? 'text-success-400 bg-success-400/15' : code === 429 ? 'text-warning-400 bg-warning-400/15' : 'text-danger-400 bg-danger-400/15'

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Key className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-black text-white">API Keys & Integrations</h2>
                <p className="text-xs text-surface-400">Manage API access, webhooks, logs, and OAuth integrations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Logs exported to CSV')}><Download className="w-3.5 h-3.5" /> Export Logs</button>
              <motion.button
                className="btn-gradient text-xs px-4 py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCreateModal(true)}
              >
                <Plus className="w-3.5 h-3.5" /> Create New Key
              </motion.button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stat Cards */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.05}>
        {[
          { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), icon: Key, gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400', sub: `${apiKeys.length} total keys` },
          { label: 'API Calls Today', value: '2,847', icon: Activity, gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400', sub: '72% of rate limit' },
          { label: 'Webhooks Active', value: webhooks.filter(w => w.status === 'active').length.toString(), icon: Wifi, gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400', sub: `${webhooks.length} endpoints` },
          { label: 'Success Rate', value: '99.7%', icon: Shield, gradient: 'from-neon-400/20 to-neon-500/5', iconColor: 'text-neon-400', sub: '142ms avg response' },
        ].map(stat => (
          <StaggerItem key={stat.label} variants={fadeUp}>
            <motion.div className="glass-card p-5 h-full" whileHover={{ y: -3 }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-surface-500 mt-0.5">{stat.sub}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Section tabs */}
      <FadeUp delay={0.09}>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1 w-fit flex-wrap">
          {([
            { key: 'keys' as const, label: 'API Keys', icon: Key },
            { key: 'webhooks' as const, label: 'Webhooks', icon: Wifi },
            { key: 'logs' as const, label: 'Logs', icon: Terminal },
            { key: 'oauth' as const, label: 'OAuth Apps', icon: Globe },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setActiveSection(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeSection === t.key ? 'bg-white/[0.08] text-white' : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>
      </FadeUp>

      <AnimatePresence mode="wait">
        {/* API KEYS */}
        {activeSection === 'keys' && (
          <motion.div key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">API Keys</h3>
                <span className="text-[10px] text-surface-500">{apiKeys.length} keys · {apiKeys.filter(k => k.status === 'active').length} active</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {apiKeys.map((apiKey, i) => (
                  <motion.div
                    key={apiKey.id}
                    className={`px-5 py-4 hover:bg-white/[0.02] transition-colors ${apiKey.status === 'revoked' ? 'opacity-50' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: apiKey.status === 'revoked' ? 0.5 : 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${apiKey.status === 'active' ? 'bg-accent-500/15' : 'bg-white/[0.06]'}`}>
                          <Key className={`w-4 h-4 ${apiKey.status === 'active' ? 'text-accent-400' : 'text-surface-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-white">{apiKey.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${apiKey.environment === 'production' ? 'bg-danger-400/15 text-danger-400' : 'bg-success-400/15 text-success-400'}`}>
                              {apiKey.environment}
                            </span>
                            {apiKey.status === 'active' ? (
                              <span className="badge bg-success-400/15 text-success-400"><span className="w-1.5 h-1.5 rounded-full bg-success-400" />Active</span>
                            ) : (
                              <span className="badge bg-danger-400/15 text-danger-400"><span className="w-1.5 h-1.5 rounded-full bg-danger-400" />Revoked</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-surface-500">
                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />Last used: {apiKey.lastUsed}</span>
                            <span className="flex items-center gap-1"><Activity className="w-2.5 h-2.5" />{apiKey.requests.toLocaleString()} requests</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {apiKey.permissions.slice(0, 3).map(p => (
                              <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">{p}</span>
                            ))}
                            {apiKey.permissions.length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-surface-500">+{apiKey.permissions.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-surface-300 font-mono bg-white/[0.04] px-2 py-1 rounded-lg hidden sm:block">
                          {revealedKeys.has(apiKey.id) ? apiKey.key.slice(0, 24) + '...' : apiKey.maskedKey}
                        </code>
                        <button onClick={() => toggleReveal(apiKey.id)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-500 hover:text-surface-200 transition-colors">
                          {revealedKeys.has(apiKey.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <motion.button
                          onClick={() => handleCopy(apiKey.id, apiKey.key)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        >
                          {copiedId === apiKey.id ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </motion.button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" onClick={() => showToast(`${apiKey.name} settings opened`)}>
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <motion.button
                          className="p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-400 transition-colors"
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => showToast(`${apiKey.name} revoked`)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security notice */}
            <FadeInWhenVisible delay={0.1}>
              <div className="glass-card p-4 border border-warning-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning-400/15 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-warning-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block mb-0.5">Security Best Practices</span>
                    <p className="text-xs text-surface-400 leading-relaxed">Rotate API keys every 90 days. Never expose production keys in client-side code. Use environment-specific keys and restrict permissions to the minimum required scope.</p>
                  </div>
                  <button className="text-xs text-accent-400 hover:text-accent-300 font-semibold flex-shrink-0" onClick={() => showToast('Security guide opened')}>Learn More</button>
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}

        {/* WEBHOOKS */}
        {activeSection === 'webhooks' && (
          <motion.div key="webhooks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Webhook Endpoints</h3>
              <motion.button className="btn-gradient text-xs" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => showToast('Webhook form opened')}>
                <Plus className="w-3.5 h-3.5" /> Add Webhook
              </motion.button>
            </div>
            <div className="space-y-3">
              {webhooks.map((webhook, i) => (
                <motion.div
                  key={webhook.id}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <code className="text-xs text-surface-200 font-mono truncate max-w-xs">{webhook.url}</code>
                        {webhook.status === 'active' ? (
                          <span className="badge bg-success-400/15 text-success-400 flex-shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-success-400" />Active</span>
                        ) : (
                          <span className="badge bg-surface-500/15 text-surface-500 flex-shrink-0">Inactive</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {webhook.events.map(event => (
                          <span key={event} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">
                            {event}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-surface-500">
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{webhook.deliveries.toLocaleString()} deliveries</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last: {webhook.lastDelivery}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" title="Test webhook" onClick={() => showToast('Test event sent to webhook')}>
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" onClick={() => showToast('Webhook settings opened')}>
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors" onClick={() => showToast('Webhook URL copied')}>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-400 transition-colors" onClick={() => showToast('Webhook deleted')}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Available events */}
            <FadeInWhenVisible delay={0.15}>
              <div className="glass-card p-5 mt-4">
                <h4 className="text-sm font-bold text-white mb-3">Available Webhook Events</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'assignment.created', 'assignment.submitted', 'grade.updated', 'grade.published',
                    'student.enrolled', 'student.grade_changed', 'notification.sent', 'report.generated',
                    'lesson.published', 'curriculum.updated',
                  ].map(event => (
                    <span key={event} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.03] text-surface-400 border border-white/[0.06]">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}

        {/* LOGS */}
        {activeSection === 'logs' && (
          <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">API Request Logs</h3>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Filter panel opened')}><Filter className="w-3.5 h-3.5" /> Filter</button>
                <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => showToast('Logs refreshed')}><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
              </div>
            </div>

            {/* Usage chart */}
            <div className="glass-card p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">API Usage This Week</h4>
                  <p className="text-xs text-surface-400 mt-0.5">{totalCalls.toLocaleString()} total calls</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-400/10 border border-warning-400/20">
                  <AlertTriangle className="w-3 h-3 text-warning-400" />
                  <span className="text-[10px] font-semibold text-warning-400">72% of rate limit</span>
                </div>
              </div>
              {(() => {
                const vals = usageData.map(d => d.calls)
                const W = 500, H = 110, PX = 18, PY = 14
                const minV = 0, maxV = maxCalls + 300
                const sx = (i: number) => PX + (i / (vals.length - 1)) * (W - PX * 2)
                const sy = (v: number) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2)
                const pts = vals.map((v, i) => ({ x: sx(i), y: sy(v) }))
                let lp = `M ${pts[0].x} ${pts[0].y}`
                for (let i = 1; i < pts.length; i++) {
                  const cpx = (pts[i].x + pts[i - 1].x) / 2
                  lp += ` C ${cpx} ${pts[i - 1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
                }
                const ap = lp + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full mb-4" style={{ height: H }}>
                    <defs>
                      <linearGradient id="api-usage-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[500, 1000, 1500, 2000, 2500].map(g => (
                      <line key={g} x1={PX} y1={sy(g)} x2={W - PX} y2={sy(g)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}
                    <path d={ap} fill="url(#api-usage-grad)" />
                    <motion.path d={lp} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                    {pts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={3.5} fill="#8b5cf6" />
                        <text x={pt.x} y={pt.y - 7} textAnchor="middle" fill="#c4b5fd" fontSize="9" fontWeight="700">
                          {vals[i] >= 1000 ? `${(vals[i]/1000).toFixed(1)}k` : vals[i]}
                        </text>
                        <text x={pt.x} y={H - 1} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">{usageData[i].day}</text>
                      </g>
                    ))}
                  </svg>
                )
              })()}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                <div><div className="text-xs text-surface-500">Rate Limit</div><div className="text-sm font-bold text-white mt-0.5">10,000 / hr</div></div>
                <div><div className="text-xs text-surface-500">Avg Response</div><div className="text-sm font-bold text-white mt-0.5">142ms</div></div>
                <div><div className="text-xs text-surface-500">Success Rate</div><div className="text-sm font-bold text-success-400 mt-0.5">99.7%</div></div>
              </div>
            </div>

            {/* Logs table */}
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Recent Requests</h4>
                <div className="relative">
                  <Search className="w-3 h-3 text-surface-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Filter logs..." className="pl-7 pr-3 py-1.5 text-[10px] rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-300 placeholder:text-surface-600 focus:outline-none w-36" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Method</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Endpoint</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden md:table-cell">Duration</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3 hidden lg:table-cell">Key</th>
                      <th className="text-left text-xs font-semibold text-surface-400 px-5 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, i) => (
                      <motion.tr
                        key={log.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      >
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${log.method === 'GET' ? 'bg-accent-500/15 text-accent-400' : log.method === 'POST' ? 'bg-success-400/15 text-success-400' : 'bg-warning-400/15 text-warning-400'}`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <code className="text-xs text-surface-200 font-mono">{log.endpoint}</code>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor(log.status)}`}>{log.status}</span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-xs text-surface-400">{log.duration}</span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="text-[10px] text-surface-500 truncate max-w-xs block">{log.keyName}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-surface-500">{log.time}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* OAUTH APPS */}
        {activeSection === 'oauth' && (
          <motion.div key="oauth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">OAuth Integrations</h3>
              <button className="btn-secondary text-xs px-3 py-1.5"><Search className="w-3.5 h-3.5" /> Browse Apps</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oauthApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: app.color + '20' }}>
                        <app.icon className="w-5 h-5" style={{ color: app.color }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{app.name}</h4>
                        <p className="text-[10px] text-surface-500 mt-0.5">{app.scope}</p>
                      </div>
                    </div>
                    {app.connected ? (
                      <span className="badge bg-success-400/15 text-success-400 flex-shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-success-400" />Connected</span>
                    ) : (
                      <span className="badge bg-surface-500/15 text-surface-500 flex-shrink-0">Not Connected</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {app.connected ? (
                      <>
                        <button className="btn-secondary text-xs px-3 py-1.5 flex-1" onClick={() => showToast(`${app.name} settings opened`)}><Settings className="w-3 h-3" /> Configure</button>
                        <button className="btn-secondary text-xs px-3 py-1.5 text-danger-400 hover:bg-danger-400/10" onClick={() => showToast(`${app.name} disconnected`)}><X className="w-3 h-3" /> Disconnect</button>
                      </>
                    ) : (
                      <motion.button className="btn-gradient text-xs w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => showToast(`Connecting to ${app.name}...`)}>
                        <Plus className="w-3.5 h-3.5" /> Connect {app.name}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <FadeInWhenVisible delay={0.15}>
              <div className="glass-card p-5 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-400/20 to-electric-500/5 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-electric-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">API Documentation</h3>
                      <p className="text-xs text-surface-400">Explore endpoints, authentication guides, and code examples.</p>
                    </div>
                  </div>
                  <motion.button className="btn-secondary text-xs px-4 py-1.5 flex-shrink-0" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    View Docs <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </FadeInWhenVisible>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Key Modal */}
      <AnimatePresence>
        {createModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModal(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><Key className="w-4 h-4 text-accent-400" /> Create API Key</h3>
                <button onClick={() => setCreateModal(false)} className="text-surface-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Key Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Production API Key"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Environment</label>
                  <div className="flex gap-2">
                    {(['development', 'production'] as const).map(env => (
                      <button
                        key={env}
                        onClick={() => setSelectedEnv(env)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border capitalize ${selectedEnv === env ? 'border-accent-500/40 bg-accent-500/10 text-white' : 'border-white/[0.06] text-surface-400 hover:border-white/[0.12]'}`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Permissions</label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {allPerms.map(perm => (
                      <button
                        key={perm}
                        onClick={() => togglePerm(perm)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-left transition-all border ${selectedPerms.includes(perm) ? 'border-accent-500/40 bg-accent-500/10 text-accent-400' : 'border-white/[0.06] text-surface-500 hover:border-white/[0.12]'}`}
                      >
                        {selectedPerms.includes(perm) ? <Check className="w-3 h-3 flex-shrink-0" /> : <div className="w-3 h-3 flex-shrink-0" />}
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Expiration</label>
                  <select className="w-full bg-white/[0.04] border border-white/[0.08] text-surface-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                    {['Never', '30 days', '90 days', '180 days', '1 year'].map(o => <option key={o} className="bg-surface-900">{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCreateModal(false)} className="btn-secondary text-xs flex-1">Cancel</button>
                <motion.button
                  className="btn-gradient text-xs flex-1"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { showToast('API key generated — copy it now'); setCreateModal(false) }}
                >
                  <Key className="w-3.5 h-3.5" /> Generate Key
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.12]"
            style={{ background: 'linear-gradient(135deg, #0a0f1a, #111827)' }}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <span className="text-xs font-semibold text-white max-w-[220px]">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
