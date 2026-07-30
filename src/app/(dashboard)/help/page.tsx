'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, ChevronRight, Rocket, Brain, Users, BarChart2,
  Plug, UserCog, BookOpen, HelpCircle, ArrowRight, Star, Clock,
  MessageSquare, Mail, MessagesSquare, Play, FileText, Shield,
  Sparkles, Zap, GraduationCap, ArrowUpRight, Headphones
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible, StaggerList, StaggerItem, fadeUp } from '@/components/ui/motion'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Category = 'all' | 'getting-started' | 'ai-tools' | 'classroom' | 'grading' | 'integrations' | 'account'

const heroStats = [
  { label: '150+ Articles',     icon: BookOpen,    gradient: 'from-accent-500/20 to-accent-600/5',   iconColor: 'text-accent-400' },
  { label: '24/7 Support',      icon: Headphones,  gradient: 'from-neon-400/20 to-neon-500/5',       iconColor: 'text-neon-400' },
  { label: '4.9 Rating',        icon: Star,        gradient: 'from-warning-400/20 to-warning-500/5', iconColor: 'text-warning-400' },
  { label: '< 2hr Response',    icon: Clock,       gradient: 'from-success-400/20 to-success-500/5', iconColor: 'text-success-400' },
]

const categories: { id: Category; label: string; icon: typeof Rocket; articles: number; color: string; iconColor: string }[] = [
  { id: 'getting-started', label: 'Getting Started',  icon: Rocket,    articles: 24, color: 'bg-accent-400/15 border-accent-500/20 hover:border-accent-400/40',   iconColor: 'text-accent-400' },
  { id: 'ai-tools',        label: 'AI Tools',         icon: Brain,     articles: 32, color: 'bg-neon-400/15 border-neon-500/20 hover:border-neon-400/40',           iconColor: 'text-neon-400' },
  { id: 'classroom',       label: 'Classroom',        icon: Users,     articles: 28, color: 'bg-electric-400/15 border-electric-500/20 hover:border-electric-400/40', iconColor: 'text-electric-400' },
  { id: 'grading',         label: 'Grading',          icon: BarChart2, articles: 18, color: 'bg-warning-400/15 border-warning-500/20 hover:border-warning-400/40',   iconColor: 'text-warning-400' },
  { id: 'integrations',    label: 'Integrations',     icon: Plug,      articles: 22, color: 'bg-success-400/15 border-success-500/20 hover:border-success-400/40',   iconColor: 'text-success-400' },
  { id: 'account',         label: 'Account',          icon: UserCog,   articles: 16, color: 'bg-danger-400/15 border-danger-500/20 hover:border-danger-400/40',     iconColor: 'text-danger-400' },
]

const faqs: { q: string; a: string; category: Category }[] = [
  {
    q: 'How do I generate a lesson plan with AI?',
    a: 'Navigate to Magic Chat or the Workspace, describe your lesson topic, grade level, and objectives. The AI will generate a complete lesson plan you can edit, customize, and save to your library.',
    category: 'ai-tools',
  },
  {
    q: 'What is the quickest way to get started?',
    a: 'After signing up, complete the onboarding wizard to set your grade level, subjects, and curriculum standards. Then head to Magic Chat and describe your first lesson -- you\'ll have a full plan in under 60 seconds.',
    category: 'getting-started',
  },
  {
    q: 'Can I customize the AI output style?',
    a: 'Yes! Go to Settings > AI Preferences to adjust tone, creativity level, default grade level, and content complexity. These settings apply to all AI-generated content across every tool.',
    category: 'ai-tools',
  },
  {
    q: 'How do I share materials with students?',
    a: 'From any lesson or course, click the Share button. You can generate a shareable link, export as PDF or DOCX, or push directly to connected platforms like Google Classroom or Canvas LMS.',
    category: 'classroom',
  },
  {
    q: 'What are Agent Swarms?',
    a: 'Agent Swarms are specialized AI agents that work collaboratively on complex tasks. For example, one agent handles curriculum mapping while another creates differentiated assessments -- all running in parallel to save you hours.',
    category: 'ai-tools',
  },
  {
    q: 'How does AI-assisted grading work?',
    a: 'Upload student submissions or paste text into the Grading Assistant. The AI evaluates responses against your rubric, provides detailed feedback, and suggests scores. You review and approve before anything is finalized.',
    category: 'grading',
  },
  {
    q: 'Can I create custom rubrics?',
    a: 'Absolutely. Use the Rubric Builder to define criteria, performance levels, and point values. You can also ask the AI to generate a rubric from your learning objectives and then fine-tune it.',
    category: 'grading',
  },
  {
    q: 'How do I connect Google Classroom?',
    a: 'Go to Settings > Integrations and click Connect next to Google Classroom. Sign in with your Google account and grant permissions. Your classes, rosters, and assignments will sync automatically.',
    category: 'integrations',
  },
  {
    q: 'Is my data secure and private?',
    a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never train AI models on your content. You maintain full ownership and can export or delete your data at any time from Settings > Data & Export.',
    category: 'account',
  },
  {
    q: 'How do I manage my classroom roster?',
    a: 'Navigate to Classroom to add students manually, import via CSV, or sync from an integrated LMS. You can organize students into groups, track participation, and manage permissions from one dashboard.',
    category: 'classroom',
  },
  {
    q: 'What integrations are supported?',
    a: 'We support Google Classroom, Microsoft Teams, Canvas LMS, Schoology, Clever, Zoom, and more. Each integration enables two-way sync for assignments, grades, and rosters.',
    category: 'integrations',
  },
  {
    q: 'How do I upgrade or change my plan?',
    a: 'Go to Settings > Billing to view your current plan and compare options. You can upgrade to Pro or Department plans instantly. Changes take effect immediately with prorated billing.',
    category: 'account',
  },
  {
    q: 'Can I collaborate with other teachers?',
    a: 'Yes! Invite colleagues from Settings > Team. Shared workspaces let you co-create lessons, share templates, and review each other\'s materials. Team members can have Admin, Teacher, or Viewer roles.',
    category: 'classroom',
  },
  {
    q: 'How do I set up curriculum standards alignment?',
    a: 'In Settings > AI Preferences, select your curriculum framework (Common Core, NGSS, IB, Cambridge, etc.). The AI will automatically tag generated content with relevant standards and suggest alignment gaps.',
    category: 'getting-started',
  },
]

const popularArticles = [
  { title: 'Complete Onboarding Guide for New Teachers',     category: 'Getting Started', readTime: '8 min',  color: 'bg-accent-400/15 text-accent-400' },
  { title: 'Mastering Magic Chat: Tips & Tricks',            category: 'AI Tools',        readTime: '12 min', color: 'bg-neon-400/15 text-neon-400' },
  { title: 'Setting Up Your First Classroom',                category: 'Classroom',       readTime: '6 min',  color: 'bg-electric-400/15 text-electric-400' },
  { title: 'AI Grading Best Practices',                      category: 'Grading',         readTime: '10 min', color: 'bg-warning-400/15 text-warning-400' },
  { title: 'Google Classroom Integration Deep Dive',         category: 'Integrations',    readTime: '7 min',  color: 'bg-success-400/15 text-success-400' },
  { title: 'Agent Swarms: Automate Your Workflow',           category: 'AI Tools',        readTime: '15 min', color: 'bg-neon-400/15 text-neon-400' },
]

const videoTutorials = [
  { title: 'Getting Started in 5 Minutes',          duration: '5:12',  category: 'Beginner',     gradient: 'from-accent-500/30 to-accent-600/10' },
  { title: 'Building Lessons with Magic Chat',      duration: '8:45',  category: 'AI Tools',     gradient: 'from-neon-400/30 to-neon-500/10' },
  { title: 'Setting Up Agent Swarms',               duration: '12:30', category: 'Advanced',     gradient: 'from-electric-400/30 to-electric-500/10' },
  { title: 'Grading & Assessment Automation',       duration: '10:15', category: 'Productivity', gradient: 'from-warning-400/30 to-warning-500/10' },
]

const supportChannels = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    desc: 'Chat with our support team in real time. Average wait under 2 minutes during business hours.',
    action: 'Start Chat',
    iconColor: 'text-accent-400',
    gradient: 'from-accent-500/20 to-accent-600/5',
  },
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Send us a detailed message and we\'ll respond within 2 hours. Perfect for complex questions.',
    action: 'Send Email',
    iconColor: 'text-neon-400',
    gradient: 'from-neon-400/20 to-neon-500/5',
  },
  {
    icon: MessagesSquare,
    title: 'Community Forum',
    desc: 'Connect with 10,000+ educators sharing tips, templates, and best practices.',
    action: 'Join Forum',
    iconColor: 'text-electric-400',
    gradient: 'from-electric-400/20 to-electric-500/5',
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filteredFaqs = useMemo(() => {
    let list = faqs
    if (activeCategory !== 'all') {
      list = list.filter(f => f.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    }
    return list
  }, [search, activeCategory])

  return (
    <div className="max-w-5xl space-y-10">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <FadeUp>
        <div className="glass-card p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent-500/[0.07] rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-neon-400/[0.05] rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-3">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-accent-500/20 to-accent-600/5"
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <HelpCircle className="w-6 h-6 text-accent-400" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">How can we help you?</h1>
            <p className="text-surface-400 text-sm mb-8 max-w-lg mx-auto">
              Search our knowledge base, browse tutorials, or reach out to our team. We're here to help you teach smarter.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles, FAQs, tutorials..."
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-14 pr-5 py-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/30 transition-all backdrop-blur-sm"
              />
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-surface-400 hover:text-white transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.08}>
        {heroStats.map(s => (
          <StaggerItem key={s.label} variants={fadeUp}>
            <motion.div
              className="glass-card p-5 h-full flex items-center gap-4"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${s.gradient}`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <span className="text-sm font-bold text-white">{s.label}</span>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* ── Category grid ────────────────────────────────────────── */}
      <FadeInWhenVisible>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Browse by Category</h2>
            {activeCategory !== 'all' && (
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setActiveCategory('all')}
                className="text-xs font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors"
              >
                Show all <ChevronRight className="w-3 h-3" />
              </motion.button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                className={`glass-card p-5 text-left group transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? cat.color
                    : 'border-transparent hover:border-white/[0.08]'
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color.split(' ')[0]}`}>
                  <cat.icon className={`w-5 h-5 ${cat.iconColor}`} />
                </div>
                <p className="text-sm font-bold text-white mb-1">{cat.label}</p>
                <p className="text-xs text-surface-500">{cat.articles} articles</p>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── Popular Articles ─────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Popular Articles</h2>
            <button className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="glass-card overflow-hidden divide-y divide-white/[0.06]">
            {popularArticles.map((article, i) => (
              <motion.div
                key={article.title}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.06] flex-shrink-0">
                  <FileText className="w-4 h-4 text-surface-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-100 truncate group-hover:text-white transition-colors">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${article.color}`}>{article.category}</span>
                    <span className="text-[10px] text-surface-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {article.readTime} read
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-accent-400 transition-colors flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">
              Frequently Asked Questions
              {activeCategory !== 'all' && (
                <span className="ml-2 text-xs font-semibold text-accent-400 bg-accent-400/15 px-2.5 py-1 rounded-full align-middle">
                  {categories.find(c => c.id === activeCategory)?.label}
                </span>
              )}
            </h2>
            <span className="text-xs text-surface-500">{filteredFaqs.length} questions</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  className="glass-card overflow-hidden"
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                      <span className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors">{faq.q}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-surface-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-white/[0.06] pt-4">
                            <p className="text-sm text-surface-300 leading-relaxed">{faq.a}</p>
                            <div className="flex items-center gap-3 mt-4">
                              <span className="text-[10px] font-semibold text-surface-500 bg-white/[0.04] px-2.5 py-1 rounded-full">
                                {categories.find(c => c.id === faq.category)?.label}
                              </span>
                              <button className="text-[10px] font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors">
                                Read full article <ArrowUpRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredFaqs.length === 0 && (
              <motion.div
                className="glass-card p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Search className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-surface-400 mb-1">No results found</p>
                <p className="text-xs text-surface-500">Try a different search term or browse by category above.</p>
              </motion.div>
            )}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── Video Tutorials ──────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-accent-400" />
              Video Tutorials
            </h2>
            <button className="text-xs text-accent-400 font-semibold hover:text-accent-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videoTutorials.map((video, i) => (
              <motion.div
                key={video.title}
                className="glass-card overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                {/* Thumbnail placeholder */}
                <div className={`relative h-36 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />
                  <motion.div
                    className="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </motion.div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors mb-1">{video.title}</p>
                  <span className="text-[10px] font-semibold text-surface-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                    {video.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── Contact Support ──────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.05}>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Contact Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportChannels.map((channel, i) => (
              <motion.div
                key={channel.title}
                className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${channel.gradient}`}>
                  <channel.icon className={`w-6 h-6 ${channel.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{channel.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed mb-5 flex-1">{channel.desc}</p>
                <motion.button
                  className="btn-secondary text-xs w-full justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {channel.action}
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── CTA footer ───────────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.1}>
        <div className="glass-card p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.06] via-transparent to-neon-400/[0.04] pointer-events-none" />
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-accent-500/20 to-accent-600/5"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <GraduationCap className="w-7 h-7 text-accent-400" />
            </motion.div>
            <h3 className="text-xl font-black text-white mb-2">Can't find what you're looking for?</h3>
            <p className="text-sm text-surface-400 mb-6 max-w-md mx-auto">
              Our support team is available around the clock. Reach out and we'll get back to you in under 2 hours.
            </p>
            <div className="flex items-center justify-center gap-3">
              <motion.a
                href="mailto:support@teachweaver.ai"
                className="btn-gradient"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4" />
                Email Support
              </motion.a>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </motion.button>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
