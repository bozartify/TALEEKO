'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Trash2, Plus, ExternalLink, Eye, EyeOff, Check, Shield, Globe, Activity, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  created: string
  lastUsed: string
  status: 'active' | 'revoked'
}

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
}

const apiKeys: ApiKey[] = [
  { id: '1', name: 'Production API Key', key: 'sk-prod-a8f3b2c1d9e7f4a6b8c2d1e9f7a3b5c8', maskedKey: 'sk-prod-...b5c8', created: 'Jan 15, 2026', lastUsed: '2 hours ago', status: 'active' },
  { id: '2', name: 'Development Key', key: 'sk-dev-x7y2z9w4v6u8t3s1r5q7p2o9n4m6l8k3', maskedKey: 'sk-dev-...l8k3', created: 'Mar 8, 2026', lastUsed: '5 days ago', status: 'active' },
  { id: '3', name: 'Legacy Integration', key: 'sk-old-j3k8l2m7n1o6p4q9r5s2t8u3v7w1x6y4', maskedKey: 'sk-old-...x6y4', created: 'Sep 22, 2025', lastUsed: 'Dec 1, 2025', status: 'revoked' },
]

const webhooks: Webhook[] = [
  { id: '1', url: 'https://api.school.edu/webhooks/taleeko', events: ['assignment.created', 'grade.updated', 'student.enrolled'], status: 'active' },
  { id: '2', url: 'https://hooks.slack.com/services/T0X/B0Y/abc123', events: ['notification.sent', 'report.generated'], status: 'active' },
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

const maxCalls = Math.max(...usageData.map(d => d.calls))

export default function ApiKeysPage() {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalCalls = usageData.reduce((sum, d) => sum + d.calls, 0)

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
              <Key className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">API Keys</h2>
              <p className="text-xs text-surface-400">Manage your API keys and webhooks</p>
            </div>
          </div>
          <motion.button
            className="btn-gradient text-xs px-4 py-2 flex items-center gap-1.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Key
          </motion.button>
        </div>
      </FadeUp>

      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.05}>
        {[
          { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), icon: Key, gradient: 'from-accent-500/20 to-accent-600/5', iconColor: 'text-accent-400' },
          { label: 'API Calls Today', value: '2,847', icon: Activity, gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400' },
          { label: 'Rate Limit', value: '10K/hr', icon: Shield, gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400' },
          { label: 'Webhooks', value: webhooks.length.toString(), icon: Globe, gradient: 'from-neon-400/20 to-neon-500/5', iconColor: 'text-neon-400' },
        ].map(stat => (
          <StaggerItem key={stat.label} variants={fadeUp}>
            <motion.div className="glass-card p-5 h-full" whileHover={{ y: -3 }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-surface-300 mt-0.5">{stat.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      <FadeUp delay={0.1}>
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">API Keys</h3>
            <span className="text-[10px] text-surface-500">{apiKeys.length} keys</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Key</th>
                  <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Created</th>
                  <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Last Used</th>
                  <th className="text-left text-xs font-semibold text-surface-300 px-5 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-surface-300 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey, i) => (
                  <motion.tr
                    key={apiKey.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-white">{apiKey.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-surface-300 font-mono bg-white/[0.04] px-2 py-1 rounded-lg">
                          {revealedKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}
                        </code>
                        <button
                          onClick={() => toggleReveal(apiKey.id)}
                          className="text-surface-500 hover:text-surface-300 transition-colors"
                        >
                          {revealedKeys.has(apiKey.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-surface-400">{apiKey.created}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-surface-500" />
                        <span className="text-xs text-surface-400">{apiKey.lastUsed}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {apiKey.status === 'active' ? (
                        <span className="badge bg-success-400/15 text-success-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger-400/15 text-danger-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-danger-400" />
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          onClick={() => handleCopy(apiKey.id, apiKey.key)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {copiedId === apiKey.id ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </motion.button>
                        <motion.button
                          className="p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Webhook Endpoints</h3>
            <motion.button
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-3 h-3" />
              Add Webhook
            </motion.button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {webhooks.map((webhook, i) => (
              <motion.div
                key={webhook.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs text-surface-200 font-mono truncate">{webhook.url}</code>
                      {webhook.status === 'active' ? (
                        <span className="badge bg-success-400/15 text-success-400 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-surface-500/15 text-surface-500 flex-shrink-0">Inactive</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {webhook.events.map(event => (
                        <span key={event} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <motion.button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeInWhenVisible delay={0.2}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">API Usage This Week</h3>
              <p className="text-xs text-surface-400 mt-0.5">{totalCalls.toLocaleString()} total calls</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-400/10 border border-warning-400/20">
              <AlertTriangle className="w-3 h-3 text-warning-400" />
              <span className="text-[10px] font-semibold text-warning-400">72% of rate limit</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {usageData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-full rounded-lg bg-gradient-to-t from-accent-500/40 to-accent-400/20 relative overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.calls / maxCalls) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-500/20 to-transparent" />
                </motion.div>
                <span className="text-[10px] text-surface-500">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-surface-500">Rate Limit</div>
              <div className="text-sm font-bold text-white mt-0.5">10,000 / hour</div>
            </div>
            <div>
              <div className="text-xs text-surface-500">Avg Response</div>
              <div className="text-sm font-bold text-white mt-0.5">142ms</div>
            </div>
            <div>
              <div className="text-xs text-surface-500">Success Rate</div>
              <div className="text-sm font-bold text-success-400 mt-0.5">99.7%</div>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.25}>
        <div className="glass-card p-5">
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
            <motion.button
              className="btn-secondary text-xs px-4 py-1.5 flex items-center gap-1.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Docs <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
