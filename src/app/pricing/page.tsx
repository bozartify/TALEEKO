'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Check, Sparkles, ArrowRight, Zap, Shield,
  Users, Globe, Bot, Star, ChevronDown
} from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    desc: 'For individual teachers getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: '#6b7280',
    features: [
      '5 AI generations per day',
      '1 active course',
      'Basic lesson plans & quizzes',
      'Community support',
      'Standard analytics',
    ],
    cta: 'Get Started Free',
    href: '/register',
  },
  {
    name: 'Professional',
    desc: 'For power-user educators',
    monthlyPrice: 19,
    yearlyPrice: 15,
    color: '#6366f1',
    popular: true,
    features: [
      'Unlimited AI generations',
      'Unlimited courses & classes',
      'All 28 AI tools',
      'Agent Swarm (3 agents)',
      'Advanced analytics & insights',
      'Rubric builder',
      'Standards alignment',
      'Priority email support',
      'Export to PDF/DOCX',
    ],
    cta: 'Start 14-Day Free Trial',
    href: '/register',
  },
  {
    name: 'Department',
    desc: 'For teams and departments',
    monthlyPrice: 49,
    yearlyPrice: 39,
    color: '#8b5cf6',
    features: [
      'Everything in Professional',
      'Up to 10 teacher seats',
      'Shared resource library',
      'Agent Swarm (unlimited)',
      'Curriculum planning tools',
      'Department analytics',
      'Slack & Teams integration',
      'Priority phone support',
    ],
    cta: 'Start Team Trial',
    href: '/register',
  },
  {
    name: 'School',
    desc: 'For whole-school adoption',
    monthlyPrice: 99,
    yearlyPrice: 79,
    color: '#22d3ee',
    features: [
      'Everything in Department',
      'Up to 100 teacher seats',
      'SSO / SAML integration',
      'Custom AI model training',
      'Admin dashboard',
      'Student data privacy (FERPA)',
      'Custom onboarding',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '/register',
  },
]

const faqs = [
  { q: 'Can I switch plans anytime?', a: 'Yes! Upgrade or downgrade at any time. Changes take effect immediately and we prorate billing.' },
  { q: 'Is there a free trial?', a: 'All paid plans include a 14-day free trial with full access. No credit card required.' },
  { q: 'What happens to my content if I cancel?', a: 'Your content is always yours. Export everything anytime, and we keep your data for 90 days after cancellation.' },
  { q: 'Is student data safe?', a: 'Absolutely. We are FERPA, COPPA, and GDPR compliant. AI processing never stores or trains on student data.' },
  { q: 'Can I use my own API key?', a: 'Professional and above plans allow you to bring your own Anthropic API key for unlimited custom usage.' },
  { q: 'Do you offer education discounts?', a: 'Title I schools and non-profit educational institutions receive 40% off all plans. Contact us for details.' },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface-950/70 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-lg">TeachWeaver</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-xs px-4 py-2">Sign In</Link>
            <Link href="/register" className="btn-primary text-xs px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
            <Sparkles className="w-3 h-3 text-accent-400" />
            <span className="text-xs font-medium text-accent-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Plans for every <span className="text-gradient">educator</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            Start free, scale as you grow. All plans include our core AI engine.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? 'text-white font-semibold' : 'text-surface-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-accent-500' : 'bg-white/[0.1]'}`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ left: annual ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white font-semibold' : 'text-surface-400'}`}>
              Annual <span className="text-accent-400 text-xs ml-1">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`glass-card p-6 flex flex-col relative ${plan.popular ? 'border-accent-500/30 shadow-[0_0_32px_rgba(99,102,241,0.1)]' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-surface-400 mt-0.5">{plan.desc}</p>
              </div>
              <div className="mb-5">
                <span className="text-3xl font-black text-white">
                  ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm text-surface-500">/mo</span>
                {annual && plan.yearlyPrice > 0 && (
                  <p className="text-[10px] text-surface-500 mt-1">Billed annually</p>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-surface-300">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-all ${
                  plan.popular
                    ? 'btn-gradient'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-black text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-surface-400" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-xs text-surface-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-electric-400/[0.04] rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white mb-2">Ready to transform your teaching?</h2>
              <p className="text-surface-400 mb-6">Join 10,000+ educators already using AI to save hours every week.</p>
              <Link href="/register" className="btn-gradient text-sm inline-flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
