'use client'
import { useState } from 'react'
import { User, Bell, Palette, Key, Globe, Save } from 'lucide-react'

const sections = [
  { id: 'profile',  label: 'Profile',        icon: User },
  { id: 'ai',       label: 'AI Preferences', icon: Palette },
  { id: 'notif',    label: 'Notifications',  icon: Bell },
  { id: 'api',      label: 'API Keys',       icon: Key },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-3 space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`sidebar-item w-full text-left ${
                  active === s.id ? 'active' : ''
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          {active === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>AJ</div>
                  <button className="btn-secondary text-xs">Change photo</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name</label>
                    <input defaultValue="Alex" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                    <input defaultValue="Johnson" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                    <input defaultValue="demo@teachweaver.ai" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">School</label>
                    <input defaultValue="Lincoln Middle School" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject(s)</label>
                    <input defaultValue="Science, Biology" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Grade Levels</label>
                    <input defaultValue="7th, 8th, 9th" className="input-base" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'ai' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">AI Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default Grade Level</label>
                  <select className="input-base">
                    <option>7th Grade</option><option>8th Grade</option><option>9th Grade</option><option>10th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default Subject</label>
                  <input defaultValue="Science" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Curriculum Standards</label>
                  <select className="input-base">
                    <option>Common Core</option><option>NGSS</option><option>State Standards</option><option>Custom</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Include differentiation</p>
                    <p className="text-xs text-slate-500">Always add differentiation strategies to materials</p>
                  </div>
                  <button className="w-10 h-6 bg-brand-600 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {active === 'notif' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {['Weekly usage summary', 'New AI tool announcements', 'Tips & best practices', 'Product updates'].map(n => (
                  <div key={n} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm font-medium text-slate-900">{n}</p>
                    <button className="w-10 h-6 bg-brand-600 rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'api' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-semibold text-amber-800">Your Anthropic API key powers the AI features. Set it in your .env file as ANTHROPIC_API_KEY.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Anthropic API Key</label>
                  <input type="password" defaultValue="sk-ant-••••••••••••••••" className="input-base font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">AI Model</label>
                  <select className="input-base">
                    <option value="claude-sonnet-4-6">claude-sonnet-4-6 (Recommended)</option>
                    <option value="claude-haiku-4-5">claude-haiku-4-5 (Faster)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-gradient">
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
