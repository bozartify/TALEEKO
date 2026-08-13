'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Palette, Key, Globe, Save, Shield, Database, Plug,
  Monitor, Moon, Sun, Check, Upload, Download, Trash2, Eye, EyeOff,
  ChevronRight, Mail, Smartphone, Lock, RefreshCw, ExternalLink,
  BarChart2, CreditCard, Users, Settings, CheckCircle
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const sections = [
  { id: 'profile',       label: 'Profile',         icon: User },
  { id: 'ai',            label: 'AI Preferences',  icon: Palette },
  { id: 'integrations',  label: 'Integrations',    icon: Plug },
  { id: 'notif',         label: 'Notifications',   icon: Bell },
  { id: 'accessibility', label: 'Accessibility',   icon: Monitor },
  { id: 'security',      label: 'Security',        icon: Shield },
  { id: 'data',          label: 'Data & Export',    icon: Database },
  { id: 'api',           label: 'API Keys',        icon: Key },
  { id: 'billing',       label: 'Billing',         icon: CreditCard },
  { id: 'team',          label: 'Team',            icon: Users },
]

const integrations = [
  { name: 'Google Classroom', desc: 'Sync classes, rosters, and assignments', connected: true, icon: '📚' },
  { name: 'Microsoft Teams',  desc: 'Share materials directly with Teams channels', connected: false, icon: '💬' },
  { name: 'Canvas LMS',       desc: 'Import/export courses and gradebook data', connected: false, icon: '🎓' },
  { name: 'Clever',           desc: 'Automatic student roster sync', connected: true, icon: '🔗' },
  { name: 'Schoology',        desc: 'Two-way sync for assignments and grades', connected: false, icon: '📖' },
  { name: 'Zoom',             desc: 'Schedule and launch virtual classes', connected: false, icon: '📹' },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [toastMsg, setToastMsg] = useState('')
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  function handleSave() {
    setSaved(true)
    showToast('Settings saved successfully!')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="hero-mesh rounded-3xl p-6 border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">Pro Plan</span>
                </div>
                <p className="text-sm text-surface-400">Manage your profile, AI preferences, integrations, and team settings</p>
              </div>
            </div>
            <motion.button className="btn-gradient text-xs flex-shrink-0" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave}>
              {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-6 flex-wrap">
            {[
              { label: 'Profile', value: 'Alex Johnson' },
              { label: 'Plan', value: 'Pro' },
              { label: 'Integrations', value: `${integrations.filter(i => i.connected).length}/${integrations.length}` },
              { label: 'API Keys', value: '2' },
              { label: 'Team', value: '4 members' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-base font-black text-white">{s.value}</span>
                <span className="text-xs text-surface-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <FadeUp>
          <div className="md:col-span-1">
            <div className="glass-card p-3 space-y-0.5">
              {sections.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`sidebar-item w-full text-left ${active === s.id ? 'active' : ''}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ x: 2 }}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === 'profile' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl"
                        style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        AJ
                      </motion.div>
                      <div className="space-y-1">
                        <button className="btn-secondary text-xs">
                          <Upload className="w-3 h-3" /> Change photo
                        </button>
                        <p className="text-xs text-surface-500">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">First Name</label>
                        <input defaultValue="Alex" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Last Name</label>
                        <input defaultValue="Johnson" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Email</label>
                        <input defaultValue="demo@teachweaver.ai" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">School / Institution</label>
                        <input defaultValue="Lincoln Middle School" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Subject(s)</label>
                        <input defaultValue="Science, Biology" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Grade Levels</label>
                        <input defaultValue="7th, 8th, 9th" className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Role</label>
                        <select className="input-base">
                          <option>Teacher</option>
                          <option>Department Head</option>
                          <option>Curriculum Designer</option>
                          <option>Administrator</option>
                          <option>Teaching Assistant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Language</label>
                        <select className="input-base">
                          <option>English</option>
                          <option>Español</option>
                          <option>Français</option>
                          <option>Deutsch</option>
                          <option>Português</option>
                          <option>العربية</option>
                          <option>中文</option>
                          <option>हिन्दी</option>
                          <option>Kiswahili</option>
                          <option>日本語</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Bio</label>
                      <textarea
                        defaultValue="Passionate science teacher with 8 years of experience in middle school education."
                        className="input-base h-20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {active === 'ai' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">AI Preferences</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Default Grade Level</label>
                        <select className="input-base">
                          <option>K-2nd Grade</option>
                          <option>3rd-5th Grade</option>
                          <option>6th-8th Grade</option>
                          <option selected>7th Grade</option>
                          <option>9th-10th Grade</option>
                          <option>11th-12th Grade</option>
                          <option>Higher Education</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-200 mb-1.5">Default Subject</label>
                        <input defaultValue="Science" className="input-base" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Curriculum Standards</label>
                      <select className="input-base">
                        <option>Common Core State Standards</option>
                        <option>NGSS (Next Generation Science Standards)</option>
                        <option>State Standards</option>
                        <option>IB (International Baccalaureate)</option>
                        <option>Cambridge (IGCSE/A-Level)</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">AI Creativity Level</label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-500">Conservative</span>
                        <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-accent-600" />
                        <span className="text-xs text-surface-500">Creative</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Default Output Language</label>
                      <select className="input-base">
                        <option>Same as input</option>
                        <option>English</option>
                        <option>Español</option>
                        <option>Français</option>
                        <option>Deutsch</option>
                        <option>Português</option>
                        <option>العربية</option>
                        <option>中文</option>
                      </select>
                    </div>
                    {[
                      { label: 'Include differentiation', desc: 'Always add differentiation strategies to materials' },
                      { label: 'Auto-align standards', desc: 'Automatically tag materials with relevant standards' },
                      { label: 'Include assessments', desc: 'Add assessment suggestions to every lesson plan' },
                      { label: 'Multilingual support', desc: 'Offer translations and bilingual content options' },
                    ].map((toggle, i) => (
                      <motion.div
                        key={toggle.label}
                        className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{toggle.label}</p>
                          <p className="text-xs text-surface-400">{toggle.desc}</p>
                        </div>
                        <button className="w-10 h-6 bg-accent-600 rounded-full relative transition-colors">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {active === 'integrations' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-1">Integrations</h3>
                  <p className="text-xs text-surface-400 mb-4">Connect your favorite education tools</p>
                  <div className="space-y-3">
                    {integrations.map((int, i) => (
                      <motion.div
                        key={int.name}
                        className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl hover:bg-white/[0.04] transition-colors"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 2 }}
                      >
                        <span className="text-2xl">{int.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{int.name}</p>
                          <p className="text-xs text-surface-400">{int.desc}</p>
                        </div>
                        {int.connected ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-success-400 bg-success-400/15 px-2.5 py-1 rounded-full">
                            <Check className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          <button className="btn-secondary text-xs px-3 py-1.5">
                            Connect
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {active === 'notif' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">Notifications</h3>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Email Notifications</p>
                    {['Weekly usage summary', 'New AI tool announcements', 'Tips & best practices', 'Product updates', 'Agent completion alerts'].map((n, i) => (
                      <motion.div
                        key={n}
                        className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-surface-500" />
                          <p className="text-sm font-medium text-white">{n}</p>
                        </div>
                        <button className="w-10 h-6 bg-accent-600 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </motion.div>
                    ))}
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 mt-6 pt-4 border-t border-white/[0.06]">Push Notifications</p>
                    {['Agent task completions', 'Student milestone alerts', 'Schedule reminders'].map((n, i) => (
                      <motion.div
                        key={n}
                        className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-surface-500" />
                          <p className="text-sm font-medium text-white">{n}</p>
                        </div>
                        <button className="w-10 h-6 bg-surface-600 rounded-full relative">
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {active === 'accessibility' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">Accessibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="w-4 h-4 text-surface-500" /> : <Sun className="w-4 h-4 text-warning-400" />}
                        <div>
                          <p className="text-sm font-semibold text-white">Dark Mode</p>
                          <p className="text-xs text-surface-400">Reduce eye strain in low-light environments</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-accent-600' : 'bg-surface-600'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Font Size</label>
                      <select className="input-base">
                        <option>Small</option>
                        <option selected>Medium</option>
                        <option>Large</option>
                        <option>Extra Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Color Contrast</label>
                      <select className="input-base">
                        <option selected>Standard</option>
                        <option>High Contrast</option>
                      </select>
                    </div>
                    {[
                      { label: 'Reduce animations', desc: 'Minimize motion for accessibility' },
                      { label: 'Screen reader optimized', desc: 'Enhanced ARIA labels and focus management' },
                      { label: 'Keyboard navigation hints', desc: 'Show keyboard shortcut indicators' },
                    ].map((toggle, i) => (
                      <div key={toggle.label} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-white">{toggle.label}</p>
                          <p className="text-xs text-surface-400">{toggle.desc}</p>
                        </div>
                        <button className="w-10 h-6 bg-surface-600 rounded-full relative">
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === 'security' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-success-400/10 border border-success-400/20 rounded-xl flex items-start gap-3">
                      <Shield className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-success-400">Your account is secured</p>
                        <p className="text-xs text-success-400/80">Two-factor authentication is enabled</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Password</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="••••••••••••" className="input-base flex-1" disabled />
                        <button className="btn-secondary text-xs px-3">
                          <Lock className="w-3 h-3" /> Change
                        </button>
                      </div>
                    </div>
                    {[
                      { label: 'Two-factor authentication', desc: 'Require a code when signing in', enabled: true },
                      { label: 'Login notifications', desc: 'Get notified of new sign-ins', enabled: true },
                      { label: 'Session timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: false },
                    ].map((s, i) => (
                      <div key={s.label} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-white">{s.label}</p>
                          <p className="text-xs text-surface-400">{s.desc}</p>
                        </div>
                        <button className={`w-10 h-6 rounded-full relative transition-colors ${s.enabled ? 'bg-accent-600' : 'bg-surface-600'}`}>
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm ${s.enabled ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/[0.06]">
                      <h4 className="text-sm font-bold text-white mb-3">Active Sessions</h4>
                      {[
                        { device: 'Chrome on MacOS', location: 'San Francisco, CA', current: true },
                        { device: 'Safari on iPhone', location: 'San Francisco, CA', current: false },
                      ].map(sess => (
                        <div key={sess.device} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                          <div className="flex items-center gap-3">
                            <Monitor className="w-4 h-4 text-surface-500" />
                            <div>
                              <p className="text-sm font-medium text-white">{sess.device}</p>
                              <p className="text-xs text-surface-500">{sess.location}</p>
                            </div>
                          </div>
                          {sess.current ? (
                            <span className="badge bg-success-400/15 text-success-400">Current</span>
                          ) : (
                            <button className="text-xs text-danger-400 font-semibold hover:text-danger-300">Revoke</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {active === 'data' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">Data & Export</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Export All Lessons', desc: 'Download all lesson plans as JSON', icon: Download },
                        { label: 'Export Analytics', desc: 'Download usage data as CSV', icon: BarChart2 },
                        { label: 'Export Student Data', desc: 'Download classroom rosters', icon: User },
                        { label: 'Backup Everything', desc: 'Full account data backup', icon: Database },
                      ].map((exp, i) => (
                        <motion.button
                          key={exp.label}
                          className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl hover:bg-white/[0.04] transition-colors text-left"
                          whileHover={{ x: 2 }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <div className="icon-bubble bg-accent-400/15 text-accent-400 flex-shrink-0">
                            <exp.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{exp.label}</p>
                            <p className="text-xs text-surface-400">{exp.desc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <h4 className="text-sm font-bold text-white mb-3">Import Data</h4>
                      <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center hover:border-accent-500/40 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-surface-200">Drop files here or click to browse</p>
                        <p className="text-xs text-surface-500 mt-1">Supports JSON, CSV, and Excel files</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <div className="p-4 bg-danger-400/10 border border-danger-400/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5 text-danger-400" />
                          <div>
                            <p className="text-sm font-semibold text-danger-400">Danger Zone</p>
                            <p className="text-xs text-danger-400/80">Permanently delete your account and all data</p>
                          </div>
                        </div>
                        <button className="mt-3 text-xs font-semibold text-danger-400 border border-danger-400/20 px-3 py-1.5 rounded-lg hover:bg-danger-400/15 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === 'api' && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-warning-400/10 border border-warning-400/20 rounded-xl flex items-start gap-3">
                      <Key className="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-warning-400 leading-relaxed">
                        Your Anthropic API key powers the AI features. Set it in your <code className="bg-warning-400/15 px-1 py-0.5 rounded">.env</code> file as <code className="bg-warning-400/15 px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Anthropic API Key</label>
                      <div className="flex gap-2">
                        <input
                          type={showKey ? 'text' : 'password'}
                          defaultValue="sk-ant-api03-xxxxxxxxxxxx"
                          className="input-base font-mono flex-1"
                        />
                        <button onClick={() => setShowKey(!showKey)} className="btn-secondary text-xs px-3">
                          {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">AI Model</label>
                      <select className="input-base">
                        <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (Recommended)</option>
                        <option value="claude-opus-4-8">Claude Opus 4.8 (Most Capable)</option>
                        <option value="claude-haiku-4-5">Claude Haiku 4.5 (Fastest)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-200 mb-1.5">Max Tokens</label>
                      <select className="input-base">
                        <option>2048 (Default)</option>
                        <option>4096 (Extended)</option>
                        <option>8192 (Maximum)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-white">Prompt Caching</p>
                        <p className="text-xs text-surface-400">Cache system prompts to reduce latency and cost</p>
                      </div>
                      <button className="w-10 h-6 bg-accent-600 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                      <h4 className="text-sm font-bold text-white mb-3">Usage This Month</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'API Calls', value: '1,247' },
                          { label: 'Tokens Used', value: '2.1M' },
                          { label: 'Estimated Cost', value: '$4.82' },
                        ].map(u => (
                          <div key={u.label} className="p-3 bg-white/[0.03] rounded-xl text-center">
                            <p className="text-lg font-black text-white">{u.value}</p>
                            <p className="text-xs text-surface-500">{u.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === 'billing' && (
                <div className="space-y-4">
                  {/* Current Plan */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Current Plan</h3>
                    <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
                          whileHover={{ scale: 1.05, rotate: 3 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CreditCard className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-bold text-white">Professional Plan</p>
                          <p className="text-xs text-surface-400">Billed monthly</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">$12<span className="text-sm font-medium text-surface-400">/mo</span></p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Lessons Created', value: '84 / 100' },
                        { label: 'AI Generations', value: '1,247 / 2,000' },
                        { label: 'Storage Used', value: '2.4 GB / 10 GB' },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          className="p-3 bg-white/[0.03] rounded-xl text-center"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <p className="text-sm font-black text-white">{stat.value}</p>
                          <p className="text-xs text-surface-500">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Plan Comparison */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Compare Plans</h3>
                    <div className="space-y-3">
                      {[
                        {
                          name: 'Free',
                          price: '$0',
                          features: { lessons: '10 / mo', ai: '50 generations', storage: '500 MB', integrations: false, analytics: false, priority: false },
                          current: false,
                        },
                        {
                          name: 'Pro',
                          price: '$12',
                          features: { lessons: '100 / mo', ai: '2,000 generations', storage: '10 GB', integrations: true, analytics: true, priority: false },
                          current: true,
                        },
                        {
                          name: 'Department',
                          price: '$39',
                          features: { lessons: 'Unlimited', ai: 'Unlimited', storage: '100 GB', integrations: true, analytics: true, priority: true },
                          current: false,
                        },
                      ].map((plan, i) => (
                        <motion.div
                          key={plan.name}
                          className={`p-4 rounded-xl border ${plan.current ? 'bg-accent-600/10 border-accent-500/30' : 'bg-white/[0.03] border-white/[0.04]'}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{plan.name}</p>
                              {plan.current && (
                                <span className="badge bg-accent-400/15 text-accent-400">Current</span>
                              )}
                            </div>
                            <p className="text-lg font-black text-white">{plan.price}<span className="text-xs font-medium text-surface-400">/mo</span></p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { label: 'Lessons', value: plan.features.lessons },
                              { label: 'AI Generations', value: plan.features.ai },
                              { label: 'Storage', value: plan.features.storage },
                              { label: 'Integrations', value: plan.features.integrations },
                              { label: 'Analytics', value: plan.features.analytics },
                              { label: 'Priority Support', value: plan.features.priority },
                            ].map(f => (
                              <div key={f.label} className="flex items-center gap-1.5">
                                {typeof f.value === 'boolean' ? (
                                  f.value ? (
                                    <Check className="w-3 h-3 text-success-400" />
                                  ) : (
                                    <span className="w-3 h-3 flex items-center justify-center text-surface-600 text-xs">--</span>
                                  )
                                ) : (
                                  <Check className="w-3 h-3 text-success-400" />
                                )}
                                <span className="text-xs text-surface-300">
                                  {typeof f.value === 'string' ? `${f.label}: ${f.value}` : f.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Payment Method</h3>
                    <motion.div
                      className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-white/[0.08] rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-surface-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Visa ending in 4242</p>
                          <p className="text-xs text-surface-400">Expires 09/2027</p>
                        </div>
                      </div>
                      <button className="btn-secondary text-xs px-3">
                        Update
                      </button>
                    </motion.div>
                  </div>

                  {/* Billing History */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        { date: 'Jul 1, 2026', amount: '$12.00', status: 'Paid', invoice: 'INV-2026-007' },
                        { date: 'Jun 1, 2026', amount: '$12.00', status: 'Paid', invoice: 'INV-2026-006' },
                        { date: 'May 1, 2026', amount: '$12.00', status: 'Paid', invoice: 'INV-2026-005' },
                      ].map((inv, i) => (
                        <motion.div
                          key={inv.invoice}
                          className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm font-semibold text-white">{inv.date}</p>
                              <p className="text-xs text-surface-500">{inv.invoice}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm font-bold text-white">{inv.amount}</p>
                            <span className="badge bg-success-400/15 text-success-400">{inv.status}</span>
                            <button className="text-xs text-accent-400 font-semibold hover:text-accent-300">
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Billing Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      className="btn-gradient"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Upgrade Plan
                    </motion.button>
                    <motion.button
                      className="btn-secondary text-danger-400 border-danger-400/20 hover:bg-danger-400/10"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel Subscription
                    </motion.button>
                  </div>
                </div>
              )}

              {active === 'team' && (
                <div className="space-y-4">
                  {/* Team Overview */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-1">Team Overview</h3>
                    <p className="text-xs text-surface-400 mb-4">Manage your school team members and roles</p>
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl">
                      <motion.div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Users className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">Lincoln Middle School</p>
                        <p className="text-xs text-surface-400">8 team members</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/[0.03] rounded-xl text-center">
                          <p className="text-lg font-black text-white">6</p>
                          <p className="text-xs text-surface-500">Active</p>
                        </div>
                        <div className="p-3 bg-white/[0.03] rounded-xl text-center">
                          <p className="text-lg font-black text-white">2</p>
                          <p className="text-xs text-surface-500">Invited</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Members</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Alex Johnson', email: 'alex.johnson@lincoln.edu', role: 'Admin', status: 'Active', initials: 'AJ', color: '#8b5cf6' },
                        { name: 'Maria Santos', email: 'maria.santos@lincoln.edu', role: 'Teacher', status: 'Active', initials: 'MS', color: '#06b6d4' },
                        { name: 'David Chen', email: 'david.chen@lincoln.edu', role: 'Teacher', status: 'Active', initials: 'DC', color: '#f59e0b' },
                        { name: 'Sarah Williams', email: 'sarah.williams@lincoln.edu', role: 'Viewer', status: 'Invited', initials: 'SW', color: '#64748b' },
                      ].map((member, i) => (
                        <motion.div
                          key={member.email}
                          className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl hover:bg-white/[0.04] transition-colors"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          whileHover={{ x: 2 }}
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}dd)` }}
                          >
                            {member.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{member.name}</p>
                            <p className="text-xs text-surface-400 truncate">{member.email}</p>
                          </div>
                          <span className={`badge ${
                            member.role === 'Admin'
                              ? 'bg-accent-400/15 text-accent-400'
                              : member.role === 'Teacher'
                                ? 'bg-success-400/15 text-success-400'
                                : 'bg-surface-400/15 text-surface-400'
                          }`}>
                            {member.role}
                          </span>
                          <span className={`badge ${
                            member.status === 'Active'
                              ? 'bg-success-400/15 text-success-400'
                              : 'bg-warning-400/15 text-warning-400'
                          }`}>
                            {member.status}
                          </span>
                          <button className="text-surface-500 hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Invite Teacher */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Invite Teacher</h3>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                        <input
                          type="email"
                          placeholder="colleague@school.edu"
                          className="input-base pl-10 w-full"
                        />
                      </div>
                      <select className="input-base w-32">
                        <option>Teacher</option>
                        <option>Viewer</option>
                        <option>Admin</option>
                      </select>
                      <motion.button
                        className="btn-gradient"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Mail className="w-4 h-4" />
                        Invite
                      </motion.button>
                    </div>
                  </div>

                  {/* Role Info */}
                  <div className="glass-card p-6">
                    <h3 className="text-base font-bold text-white mb-4">Role Permissions</h3>
                    <div className="space-y-3">
                      {[
                        { role: 'Admin', desc: 'Full access to all settings, billing, team management, and content creation', color: 'text-accent-400' },
                        { role: 'Teacher', desc: 'Create and edit lessons, view analytics, and manage own content', color: 'text-success-400' },
                        { role: 'Viewer', desc: 'View shared lessons and resources. Cannot create or edit content', color: 'text-surface-400' },
                      ].map((info, i) => (
                        <motion.div
                          key={info.role}
                          className="flex items-start gap-3 p-4 bg-white/[0.03] rounded-xl"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-surface-500" />
                          <div>
                            <p className={`text-sm font-semibold ${info.color}`}>{info.role}</p>
                            <p className="text-xs text-surface-400">{info.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handleSave}
              className="btn-gradient"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08]"
            style={{ background: 'linear-gradient(135deg,#0a0f1a,#111827)' }}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-white font-medium">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
