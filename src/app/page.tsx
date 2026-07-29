'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Sparkles, BookOpen, ClipboardList, FileText,
  Zap, BarChart2, ArrowRight, CheckCircle, Star, ChevronRight
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

const tools = [
  { icon: BookOpen,      label: 'Lesson Plans',   desc: 'Full lesson plans in seconds',    gradient: 'from-accent-500/20 to-accent-600/5',  iconColor: 'text-accent-400' },
  { icon: ClipboardList, label: 'Quiz Generator',  desc: 'Auto-graded assessments',         gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400' },
  { icon: FileText,      label: 'Worksheets',      desc: 'Practice sheets & activities',    gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400' },
  { icon: Zap,           label: 'Activities',      desc: 'Engaging classroom projects',     gradient: 'from-electric-400/20 to-electric-500/5', iconColor: 'text-electric-400' },
  { icon: BarChart2,     label: 'Lesson Analysis', desc: 'AI feedback on your lessons',     gradient: 'from-neon-400/20 to-neon-500/5',      iconColor: 'text-neon-400' },
  { icon: Sparkles,      label: 'Magic Chat',      desc: 'Your always-on AI co-teacher',   gradient: 'from-danger-400/20 to-danger-500/5',  iconColor: 'text-danger-400' },
]

const stats = [
  { value: '10,000+', label: 'Teachers using TeachWeaver' },
  { value: '50+',     label: 'AI-powered tools' },
  { value: '3 min',   label: 'Average lesson plan time' },
  { value: '4.9',     label: 'Teacher satisfaction' },
]

const features = [
  'Lesson plans aligned to your standards',
  'Quiz & worksheet generation in seconds',
  'Differentiation strategies included',
  'Export to Google Docs & PDF',
  'Works for K-12 & Higher Ed',
  'All subjects supported',
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Science Teacher',
    school: 'Lincoln Middle School',
    initials: 'SM',
    gradient: 'from-indigo-500 to-violet-500',
    quote: 'The lesson planning tool cut my prep time from 2 hours to 15 minutes. I finally have my evenings back and my lessons are actually better.',
  },
  {
    name: 'James Okafor',
    role: 'Math Department Chair',
    school: 'Westfield High School',
    initials: 'JO',
    gradient: 'from-violet-500 to-purple-500',
    quote: 'Quiz generation is a game-changer. I create differentiated assessments for three levels in the time it used to take me to write one quiz.',
  },
  {
    name: 'Maria Santos',
    role: '4th Grade Teacher',
    school: 'Riverside Elementary',
    initials: 'MS',
    gradient: 'from-indigo-400 to-blue-500',
    quote: 'The differentiation features are incredible. It automatically suggests modifications for my ELL students and gifted learners. Every kid gets what they need.',
  },
  {
    name: 'David Chen',
    role: 'AP History Teacher',
    school: 'Oakdale Preparatory',
    initials: 'DC',
    gradient: 'from-purple-500 to-indigo-500',
    quote: 'I was skeptical about AI in education, but TeachWeaver understands pedagogy. The worksheet generator creates rigorous, standards-aligned materials every time.',
  },
  {
    name: 'Priya Sharma',
    role: 'Special Education',
    school: 'Greenwood Academy',
    initials: 'PS',
    gradient: 'from-blue-500 to-violet-500',
    quote: 'I save at least 6 hours a week on IEP-aligned materials. The AI adapts content to each student\'s level without me having to rewrite everything manually.',
  },
  {
    name: 'Angela Torres',
    role: 'ELA Teacher',
    school: 'Maplewood Middle School',
    initials: 'AT',
    gradient: 'from-violet-400 to-indigo-500',
    quote: 'Magic Chat feels like having a co-teacher available 24/7. I brainstorm lesson ideas at midnight and have a polished plan ready before first period.',
  },
]

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/dashboard' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-200">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-surface-950/70 backdrop-blur-2xl"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">TeachWeaver</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-400">
            <a href="#tools" className="hover:text-white transition-colors">Tools</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-surface-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register" className="btn-primary text-xs px-4 py-2">Start Free</Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-electric-400/[0.05] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neon-400/[0.04] rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-accent-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Claude AI
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
              Teaching tools that{' '}
              <span className="text-gradient">actually save time</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-xl text-surface-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              TeachWeaver uses AI to generate lesson plans, quizzes, worksheets, and activities in minutes. Built for teachers, by people who love education.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard" className="btn-gradient text-base px-8 py-4">
                  <Sparkles className="w-4 h-4" />
                  Start Creating for Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <Link href="/login" className="btn-secondary text-base px-8 py-4">Sign in</Link>
            </div>
            <p className="text-xs text-surface-500 mt-4">No credit card required · Free for educators</p>
          </FadeUp>
        </div>

        {/* Stats */}
        <StaggerList className="max-w-3xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 relative" delay={0.1}>
          {stats.map((s) => (
            <StaggerItem key={s.label} variants={fadeUp} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-surface-500">{s.label}</div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="max-w-6xl mx-auto relative">
          <FadeInWhenVisible className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">Every tool a teacher needs</h2>
            <p className="text-lg text-surface-400">AI-powered tools for every part of your teaching workflow</p>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <FadeInWhenVisible key={tool.label} delay={i * 0.07}>
                <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link href="/dashboard" className="glass-card group block p-6 transition-all duration-300">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${tool.gradient}`}>
                      <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-white mb-1.5">{tool.label}</h3>
                    <p className="text-sm text-surface-400 mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-1 text-accent-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Try it free <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-black text-white mb-6">Save 5+ hours<br />every week</h2>
            <p className="text-lg text-surface-400 mb-8">
              TeachWeaver handles the planning so you can focus on what matters most — your students.
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <FadeInWhenVisible key={f} delay={i * 0.06}>
                  <li className="flex items-center gap-3 text-sm text-surface-300">
                    <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0" />
                    {f}
                  </li>
                </FadeInWhenVisible>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block mt-8">
              <Link href="/dashboard" className="btn-gradient inline-flex">Get started free</Link>
            </motion.div>
          </FadeInWhenVisible>

          {/* Mock chat preview */}
          <FadeInWhenVisible delay={0.15}>
            <motion.div
              className="glass-card p-1"
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              <div className="rounded-t-xl bg-surface-800/80 px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-danger-400/60" />
                <div className="w-3 h-3 rounded-full bg-warning-400/60" />
                <div className="w-3 h-3 rounded-full bg-success-400/60" />
                <span className="text-xs text-surface-500 ml-2">Magic Chat</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-accent-500/20 text-accent-200 text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs border border-accent-500/10">
                    Create a 45-min lesson on photosynthesis for 7th grade
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/[0.06] text-surface-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-xs border border-white/[0.06]">
                    Here&apos;s your complete lesson plan!<br />
                    <span className="text-surface-500">Warm-up &rarr; Direct instruction &rarr; Lab &rarr; Exit ticket</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-accent-500/20 text-accent-200 text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-xs border border-accent-500/10">
                    Now create a 10-question quiz
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/[0.06] text-surface-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-xs border border-white/[0.06]">
                    Generated 10 questions with answer key
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 bg-white/[0.04] rounded-full px-3 py-1.5 text-xs text-surface-500 border border-white/[0.06]">Ask anything...</div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/[0.05] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <FadeInWhenVisible className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">Loved by teachers everywhere</h2>
            <p className="text-lg text-surface-400">See what educators are saying about TeachWeaver</p>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <FadeInWhenVisible key={t.name} delay={i * 0.07}>
                <motion.div
                  className="glass-card p-6 h-full flex flex-col"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-warning-400 fill-warning-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-xs font-bold text-white">{t.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-surface-500">{t.role} &middot; {t.school}</div>
                    </div>
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <FadeInWhenVisible>
          <div className="max-w-3xl mx-auto text-center glass-card p-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-500/[0.08] rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <GraduationCap className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-4">Ready to teach smarter?</h2>
              <p className="text-lg text-surface-400 mb-8">Join thousands of educators saving time with TeachWeaver</p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link href="/dashboard" className="btn-gradient text-base px-8 py-4">
                  <Sparkles className="w-4 h-4" />
                  Start for free today
                </Link>
              </motion.div>
              <div className="flex items-center justify-center gap-1 mt-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-warning-400 fill-warning-400" />)}
                <span className="text-xs text-surface-500 ml-2">Loved by 10,000+ teachers</span>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">TeachWeaver</span>
              </div>
              <p className="text-xs text-surface-500 leading-relaxed">AI-powered tools that help teachers save time and teach better.</p>
            </div>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-surface-500 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-500">&copy; 2026 TeachWeaver. Built for educators everywhere.</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 text-warning-400 fill-warning-400" />
              ))}
              <span className="text-xs text-surface-500 ml-1">Loved by 10,000+ teachers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
