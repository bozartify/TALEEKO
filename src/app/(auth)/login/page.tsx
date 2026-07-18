'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Sparkles, ArrowRight, Eye, EyeOff, BookOpen,
  ClipboardList, Users, Shield, Globe, Zap, Star
} from 'lucide-react'

const features = [
  { icon: Sparkles, text: 'AI-powered lesson plans in seconds' },
  { icon: ClipboardList, text: 'Auto-generate quizzes & assessments' },
  { icon: Users, text: 'Manage classes & track student progress' },
  { icon: Globe, text: 'Multi-language content in 10+ languages' },
  { icon: Shield, text: 'Standards-aligned curriculum mapping' },
  { icon: Zap, text: 'Autonomous agent swarm for scale' },
]

const testimonials = [
  { name: 'Dr. Sarah Chen', role: 'Science Dept Head', text: 'Saved me 15+ hours per week on lesson planning.' },
  { name: 'Marcus Rivera', role: 'Math Teacher', text: 'The AI-generated quizzes are incredibly well-tailored.' },
  { name: 'Amara Okafor', role: 'ELA Teacher', text: 'Multi-language support changed how I teach my ESL students.' },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen hero-mesh flex">
      {/* Left panel — features */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-md">
          <motion.div
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-black text-slate-900">TeachWeaver</span>
          </motion.div>

          <motion.h1
            className="text-4xl font-black text-slate-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Your AI-Powered
            <br />
            <span className="text-gradient">Teaching Platform</span>
          </motion.h1>
          <motion.p
            className="text-slate-500 mb-8 text-base leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create lesson plans, quizzes, worksheets, and more — all powered by AI that understands your curriculum.
          </motion.p>

          <div className="space-y-3 mb-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-700">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white/70 rounded-2xl p-5 border border-slate-100"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-xs text-slate-400 ml-1">4.9/5 from 2,400+ teachers</span>
            </div>
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${['#8b5cf6','#f97316','#14b8a6'][i]}, ${['#6d28d9','#ea580c','#0d9488'][i]})` }}
                  >
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.name} · {t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-brand-200/20 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-orange-200/20 blur-3xl" />
      </motion.div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900">TeachWeaver</span>
            </Link>
            <p className="text-slate-500 text-sm mt-2">Your AI-powered teaching assistant</p>
          </div>

          {/* Card */}
          <motion.div
            className="bg-white rounded-3xl shadow-card-hover border border-slate-100 p-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue</p>

            {/* Social logins */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </motion.button>
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Microsoft
              </motion.button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or continue with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  defaultValue="demo@teachweaver.ai"
                  className="input-base"
                  placeholder="you@school.edu"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button type="button" className="text-xs text-brand-600 font-semibold hover:text-brand-700">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="demo123"
                    className="input-base pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                <label htmlFor="remember" className="text-xs text-slate-600">Remember me for 30 days</label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full justify-center mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Sparkles className="w-4 h-4" />Sign in<ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <Link href="/dashboard" className="text-brand-600 font-semibold hover:text-brand-700">Start for free</Link>
              </p>
            </div>
          </motion.div>

          {/* Demo note */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 font-semibold px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Demo mode
              </span>
              {' '}Any email/password works
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
