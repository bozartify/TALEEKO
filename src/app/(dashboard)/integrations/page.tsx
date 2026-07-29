'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plug, Search, Check, Globe, ChevronRight, Zap, ExternalLink } from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

type IntegrationStatus = 'connected' | 'not_connected' | 'coming_soon'
type Category = 'LMS' | 'Communication' | 'Storage' | 'Assessment'

interface Integration {
  name: string
  emoji: string
  category: Category
  description: string
  status: IntegrationStatus
}

const integrations: Integration[] = [
  { name: 'Google Classroom', emoji: '📚', category: 'LMS', description: 'Sync classes, assignments, and grades automatically with Google Classroom.', status: 'connected' },
  { name: 'Canvas LMS', emoji: '🎓', category: 'LMS', description: 'Connect your Canvas courses for seamless content and grade syncing.', status: 'connected' },
  { name: 'PowerSchool', emoji: '📊', category: 'LMS', description: 'Import student data and sync gradebooks with PowerSchool SIS.', status: 'not_connected' },
  { name: 'Slack', emoji: '💬', category: 'Communication', description: 'Send notifications and updates directly to your Slack workspace.', status: 'connected' },
  { name: 'Gmail', emoji: '📧', category: 'Communication', description: 'Automate email communications with students and parents.', status: 'not_connected' },
  { name: 'Google Drive', emoji: '📁', category: 'Storage', description: 'Store and access lesson materials directly from Google Drive.', status: 'connected' },
  { name: 'OneDrive', emoji: '🗂️', category: 'Storage', description: 'Connect Microsoft OneDrive for cloud file storage and sharing.', status: 'not_connected' },
  { name: 'Microsoft Teams', emoji: '📝', category: 'Communication', description: 'Integrate with Teams for video calls and collaboration channels.', status: 'not_connected' },
  { name: 'Clever', emoji: '🔗', category: 'LMS', description: 'Single sign-on and automatic rostering through Clever.', status: 'coming_soon' },
  { name: 'Schoology', emoji: '📋', category: 'LMS', description: 'Sync coursework and analytics with the Schoology platform.', status: 'coming_soon' },
  { name: 'Khan Academy', emoji: '🎯', category: 'Assessment', description: 'Assign practice exercises and track mastery on Khan Academy.', status: 'coming_soon' },
  { name: 'Notion', emoji: '📖', category: 'Storage', description: 'Organize lesson plans and resources in your Notion workspace.', status: 'coming_soon' },
]

const tabs = ['All', 'Connected', 'LMS', 'Communication', 'Storage'] as const

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [search, setSearch] = useState('')

  const filtered = integrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (activeTab === 'All') return true
    if (activeTab === 'Connected') return i.status === 'connected'
    return i.category === activeTab
  })

  const connectedCount = integrations.filter(i => i.status === 'connected').length

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Plug className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Integrations</h2>
              <p className="text-xs text-surface-400">Connect your favorite tools and platforms</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-400/10 border border-success-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
              <span className="text-xs font-semibold text-success-400">{connectedCount} Connected</span>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.04] border border-white/[0.08] text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 w-52"
            />
          </div>
          <div className="flex items-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white/[0.08] text-white'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.08}>
        <AnimatePresence mode="popLayout">
          {filtered.map(integration => (
            <StaggerItem key={integration.name} variants={fadeUp} layout>
              <motion.div
                className="glass-card p-5 h-full flex flex-col"
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl">
                      {integration.emoji}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{integration.name}</h3>
                      <span className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">{integration.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {integration.status === 'connected' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                        <span className="text-[10px] font-semibold text-success-400">Connected</span>
                      </>
                    )}
                    {integration.status === 'not_connected' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-500" />
                        <span className="text-[10px] font-semibold text-surface-500">Not Connected</span>
                      </>
                    )}
                    {integration.status === 'coming_soon' && (
                      <span className="badge bg-warning-400/15 text-warning-400">Coming Soon</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-surface-400 leading-relaxed mb-4 flex-1">{integration.description}</p>

                <div>
                  {integration.status === 'connected' && (
                    <motion.button
                      className="btn-secondary text-xs px-4 py-1.5 w-full flex items-center justify-center gap-1.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Disconnect
                    </motion.button>
                  )}
                  {integration.status === 'not_connected' && (
                    <motion.button
                      className="btn-primary text-xs px-4 py-1.5 w-full flex items-center justify-center gap-1.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-3 h-3" />
                      Connect
                    </motion.button>
                  )}
                  {integration.status === 'coming_soon' && (
                    <button
                      className="text-xs px-4 py-1.5 w-full rounded-xl bg-white/[0.03] border border-white/[0.06] text-surface-500 cursor-not-allowed flex items-center justify-center gap-1.5"
                      disabled
                    >
                      Notify Me
                    </button>
                  )}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerList>

      {filtered.length === 0 && (
        <FadeUp delay={0.1}>
          <div className="glass-card p-12 text-center">
            <Search className="w-8 h-8 text-surface-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No integrations found</h3>
            <p className="text-xs text-surface-400">Try adjusting your search or filter criteria</p>
          </div>
        </FadeUp>
      )}

      <FadeInWhenVisible delay={0.15}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-600/5 flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Request an Integration</h3>
                <p className="text-xs text-surface-400">Don&apos;t see what you need? Let us know which tools you&apos;d like connected.</p>
              </div>
            </div>
            <motion.button
              className="btn-secondary text-xs px-4 py-1.5 flex items-center gap-1.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
