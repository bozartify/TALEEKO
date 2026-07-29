'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, Rocket, Brain, Keyboard, Mail,
  ArrowRight, BookOpen, HelpCircle
} from 'lucide-react'
import { FadeUp, FadeInWhenVisible } from '@/components/ui/motion'

const faqs = [
  {
    q: 'How do I generate a lesson plan with AI?',
    a: 'Navigate to Magic Chat or the Workspace, describe your lesson topic, grade level, and objectives. The AI will generate a complete lesson plan you can edit and save.',
  },
  {
    q: 'Can I customize the AI output style?',
    a: 'Yes! Go to Settings > AI Preferences to adjust tone, creativity level, default grade level, and content complexity. These settings apply to all AI-generated content.',
  },
  {
    q: 'How do I share materials with students?',
    a: 'From any lesson or course, click the Share button. You can generate a link, export as PDF, or push directly to connected platforms like Google Classroom.',
  },
  {
    q: 'What are Agent Swarms?',
    a: 'Agent Swarms are specialized AI agents that work together to handle complex tasks like curriculum planning, differentiation, and assessment creation simultaneously.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All data is encrypted at rest and in transit. We never train AI models on your content. You can export or delete your data at any time from Settings.',
  },
  {
    q: 'How do I connect external tools?',
    a: 'Go to Settings > Integrations to connect Google Classroom, Microsoft Teams, Canvas LMS, Clever, and other education platforms for seamless data sync.',
  },
]

const quickLinks = [
  {
    icon: Rocket,
    title: 'Getting Started',
    desc: 'Learn the basics and set up your first course',
    color: 'text-accent-400 bg-accent-400/15',
  },
  {
    icon: Brain,
    title: 'AI Tools Guide',
    desc: 'Master all AI-powered features and agents',
    color: 'text-neon-400 bg-neon-400/15',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    desc: 'Speed up your workflow with key combos',
    color: 'text-electric-400 bg-electric-400/15',
  },
  {
    icon: Mail,
    title: 'Contact Support',
    desc: 'Reach our team for personalized help',
    color: 'text-amber-400 bg-amber-400/15',
  },
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl space-y-10">
      <FadeUp>
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-accent-400" />
            <h1 className="text-3xl font-black text-white">Help Center</h1>
          </div>
          <p className="text-surface-400 text-sm mb-6 max-w-md mx-auto">
            Find answers, explore guides, and get the support you need.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for help..."
              className="input-base pl-12 py-3 text-base"
            />
          </div>
        </div>
      </FadeUp>

      <FadeInWhenVisible>
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-5 h-5 text-surface-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-surface-300 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-surface-500 text-sm">No results found for your search.</p>
              </div>
            )}
          </div>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.1}>
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.title}
                className="glass-card p-5 flex items-start gap-4 cursor-pointer group"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -2 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white mb-1">{link.title}</p>
                  <p className="text-xs text-surface-400">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 transition-colors mt-1 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.2}>
        <div className="glass-card p-8 text-center">
          <BookOpen className="w-10 h-10 text-accent-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
          <p className="text-sm text-surface-400 mb-5 max-w-sm mx-auto">
            Our support team is here for you. Reach out and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@teachweaver.ai"
            className="btn-gradient inline-flex"
          >
            <Mail className="w-4 h-4" /> Email Support
          </a>
        </div>
      </FadeInWhenVisible>
    </div>
  )
}
