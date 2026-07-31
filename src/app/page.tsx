'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Sparkles, BookOpen, ClipboardList, FileText,
  Zap, BarChart2, ArrowRight, CheckCircle, Star, ChevronRight
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const tools = [
  { icon: BookOpen,      label: 'Lesson Plans',    desc: 'Full, standards-aligned plans in a single prompt.', tint: 'bg-accent-500/12',  iconColor: 'text-accent-400' },
  { icon: ClipboardList, label: 'Quiz Generator',  desc: 'Auto-graded assessments with answer keys.',         tint: 'bg-warning-400/12', iconColor: 'text-warning-400' },
  { icon: FileText,      label: 'Worksheets',      desc: 'Practice sheets and activities, differentiated.',    tint: 'bg-success-400/12', iconColor: 'text-success-400' },
  { icon: Zap,           label: 'Activities',      desc: 'Engaging projects mapped to your objectives.',       tint: 'bg-electric-400/14', iconColor: 'text-electric-400' },
  { icon: BarChart2,     label: 'Lesson Analysis', desc: 'Candid AI feedback on what you already teach.',       tint: 'bg-neon-400/14',    iconColor: 'text-neon-400' },
  { icon: Sparkles,      label: 'Magic Chat',      desc: 'An always-on co-teacher for the messy middle.',      tint: 'bg-accent-500/12',  iconColor: 'text-accent-300' },
]

const stats = [
  { value: '10,000+', label: 'Teachers on TeachWeaver' },
  { value: '50+',     label: 'Purpose-built tools' },
  { value: '3 min',   label: 'To a full lesson plan' },
  { value: '4.9', suffix: '/5', label: 'Average teacher rating' },
]

const features = [
  'Lesson plans aligned to your standards',
  'Quizzes and worksheets in seconds',
  'Differentiation built into every draft',
  'Export to Google Docs and PDF',
  'K-12 through higher ed',
  'Every subject, every grade band',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-200">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
        style={{ background: 'rgba(23, 20, 15, 0.82)', backdropFilter: 'blur(12px)' }}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent-500/15 ring-1 ring-accent-500/25">
              <GraduationCap className="w-[18px] h-[18px] text-accent-400" />
            </div>
            <span className="display text-[19px] text-surface-50">TeachWeaver</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-surface-400">
            <a href="#tools" className="hover:text-surface-100 transition-colors">Tools</a>
            <a href="#features" className="hover:text-surface-100 transition-colors">How it helps</a>
            <Link href="/pricing" className="hover:text-surface-100 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-surface-400 hover:text-surface-100 transition-colors">Sign in</Link>
            <Link href="/register" className="btn-primary text-xs px-4 py-2">Start free</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* One warm light source, top-left — a desk lamp, not a neon fog. */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-[560px] h-[420px] bg-accent-500/[0.06] rounded-full blur-[130px]" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 text-accent-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8 bg-accent-500/10 border border-accent-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Claude
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="display text-5xl md:text-[5.25rem] text-surface-50 mb-7 leading-[1.02]">
              Teaching tools that give you back your <span className="text-marigold italic">evenings</span>.
            </h1>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-lg md:text-xl text-surface-300 mb-10 max-w-2xl leading-relaxed">
              Lesson plans, quizzes, worksheets, rubrics. TeachWeaver drafts the paperwork in minutes,
              so the hours you have left go to the twenty-eight faces in the room.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard" className="btn-primary text-base px-7 py-3.5">
                  <Sparkles className="w-4 h-4" />
                  Start creating, free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <Link href="/login" className="btn-secondary text-base px-7 py-3.5">Sign in</Link>
            </div>
            <p className="text-xs text-surface-500 mt-4">No credit card. Free for individual educators.</p>
          </FadeUp>
        </div>

        {/* Credibility line — editorial figures, not the four-metric template. */}
        <StaggerList className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 relative border-t border-white/[0.06] pt-10" delay={0.1}>
          {stats.map((s) => (
            <StaggerItem key={s.label} variants={fadeUp}>
              <div className="display text-4xl text-surface-50 mb-1.5">
                {s.value}<span className="text-2xl text-surface-400">{s.suffix ?? ''}</span>
              </div>
              <div className="text-xs text-surface-400 leading-snug">{s.label}</div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Tools */}
      <section id="tools" className="py-24 px-6 relative border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto relative">
          <FadeInWhenVisible className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-[0.18em] text-accent-400 mb-4">The toolkit</p>
            <h2 className="display text-4xl md:text-5xl text-surface-50 mb-4">Everything the prep period never had time for</h2>
            <p className="text-lg text-surface-400">One workspace for every part of the planning workflow.</p>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <FadeInWhenVisible key={tool.label} delay={i * 0.06}>
                <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                  <Link href="/dashboard" className="glass-card group block p-6 h-full transition-all duration-200">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${tool.tint}`}>
                      <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-surface-50 mb-1.5">{tool.label}</h3>
                    <p className="text-sm text-surface-400 mb-4 leading-relaxed">{tool.desc}</p>
                    <div className="flex items-center gap-1 text-accent-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Open it <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeInWhenVisible>
            <h2 className="display text-4xl md:text-5xl text-surface-50 mb-6 leading-[1.05]">Five hours back,<br />every single week.</h2>
            <p className="text-lg text-surface-400 mb-8 leading-relaxed">
              TeachWeaver carries the planning load so your attention stays where it belongs.
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <FadeInWhenVisible key={f} delay={i * 0.05}>
                  <li className="flex items-center gap-3 text-sm text-surface-300">
                    <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
                    {f}
                  </li>
                </FadeInWhenVisible>
              ))}
            </ul>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block mt-8">
              <Link href="/dashboard" className="btn-primary inline-flex">Get started free</Link>
            </motion.div>
          </FadeInWhenVisible>

          {/* Chat preview */}
          <FadeInWhenVisible delay={0.15}>
            <div className="glass-card p-1.5">
              <div className="rounded-t-lg px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]" style={{ background: 'var(--panel-raised)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-danger-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success-400/60" />
                <span className="text-xs text-surface-500 ml-2 font-mono">Magic Chat</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-accent-500/15 text-accent-100 text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs border border-accent-500/15">
                    Create a 45-min lesson on photosynthesis for 7th grade
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-accent-500/15">
                    <Sparkles className="w-3 h-3 text-accent-400" />
                  </div>
                  <div className="text-surface-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-xs border border-white/[0.06]" style={{ background: 'rgba(240,224,197,0.05)' }}>
                    Here&apos;s your complete lesson plan.<br />
                    <span className="text-surface-500">Warm-up &rarr; Direct instruction &rarr; Lab &rarr; Exit ticket</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-accent-500/15 text-accent-100 text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs border border-accent-500/15">
                    Now a 10-question quiz with an answer key
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-accent-500/15">
                    <Sparkles className="w-3 h-3 text-accent-400" />
                  </div>
                  <div className="text-surface-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-xs border border-white/[0.06]" style={{ background: 'rgba(240,224,197,0.05)' }}>
                    Generated 10 questions, aligned and graded.
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 rounded-full px-3 py-1.5 text-xs text-surface-500 border border-white/[0.06]" style={{ background: 'rgba(240,224,197,0.04)' }}>Ask anything...</div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-accent-500 text-[#1a1409]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <FadeInWhenVisible>
          <div className="max-w-3xl mx-auto text-center hero-mesh rounded-2xl p-16">
            <div className="w-14 h-14 rounded-xl mx-auto mb-6 flex items-center justify-center bg-accent-500/15 ring-1 ring-accent-500/25">
              <GraduationCap className="w-7 h-7 text-accent-400" />
            </div>
            <h2 className="display text-4xl md:text-5xl text-surface-50 mb-4">Ready to teach smarter?</h2>
            <p className="text-lg text-surface-400 mb-8">Join thousands of educators who reclaimed their evenings.</p>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-4">
                <Sparkles className="w-4 h-4" />
                Start for free today
              </Link>
            </motion.div>
            <div className="flex items-center justify-center gap-1 mt-5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-warning-400 fill-warning-400" />)}
              <span className="text-xs text-surface-500 ml-2">Loved by 10,000+ teachers</span>
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-accent-500/15">
              <GraduationCap className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <span className="display text-sm text-surface-100">TeachWeaver</span>
          </div>
          <p className="text-xs text-surface-500">&copy; 2025 TeachWeaver. Built for educators everywhere.</p>
        </div>
      </footer>
    </div>
  )
}
