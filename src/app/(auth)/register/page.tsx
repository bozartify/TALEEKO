'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Sparkles, ArrowRight, Eye, EyeOff, Check,
  BookOpen, Users, Zap, Shield
} from 'lucide-react'

const plans = [
  { name: 'Free', price: '$0', features: ['5 AI generations/day', '1 course', 'Basic analytics'] },
  { name: 'Pro', price: '$19', features: ['Unlimited generations', 'Unlimited courses', 'Advanced analytics', 'Agent Swarm', 'Priority support'], popular: true },
  { name: 'School', price: '$99', features: ['Everything in Pro', 'Up to 50 teachers', 'Admin dashboard', 'SSO integration', 'Custom AI training'] },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'plan' | 'details'>('plan')
  const [selectedPlan, setSelectedPlan] = useState('Pro')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push('/onboarding')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-500/[0.07] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-500/[0.05] rounded-full blur-[100px]" />

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">TeachWeaver</span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-2">Create your account</h1>
          <p className="text-sm text-surface-400">Join 10,000+ educators using AI to transform teaching</p>
        </div>

        {step === 'plan' ? (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan, i) => (
                <motion.button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`glass-card p-6 text-left transition-all relative ${
                    selectedPlan === plan.name
                      ? 'border-accent-500/40 shadow-[0_0_24px_rgba(99,102,241,0.15)]'
                      : ''
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-2xl font-black text-white mb-0.5">{plan.price}<span className="text-sm font-normal text-surface-400">/mo</span></p>
                  <ul className="space-y-2 mt-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-surface-300">
                        <Check className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.name && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-accent-500/50 pointer-events-none"
                      layoutId="plan-ring"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <div className="text-center">
              <motion.button
                className="btn-gradient text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('details')}
              >
                Continue with {selectedPlan}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-xs text-surface-400">{selectedPlan} Plan selected</span>
                <button onClick={() => setStep('plan')} className="ml-auto text-xs text-accent-400 hover:text-accent-300">Change</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1.5">First name</label>
                    <input type="text" className="input-base" placeholder="Sarah" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1.5">Last name</label>
                    <input type="text" className="input-base" placeholder="Chen" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5">Work email</label>
                  <input type="email" className="input-base" placeholder="sarah@school.edu" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-base pr-10"
                      placeholder="Min 8 characters"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1.5">School / Institution</label>
                  <input type="text" className="input-base" placeholder="Lincoln High School" />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" className="mt-0.5 rounded border-white/[0.1] bg-white/[0.04]" required />
                  <span className="text-xs text-surface-400">I agree to the Terms of Service and Privacy Policy</span>
                </div>
                <motion.button
                  type="submit"
                  className="btn-gradient w-full text-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </form>
            </div>
            <p className="text-center text-xs text-surface-500 mt-4">
              Already have an account? <Link href="/login" className="text-accent-400 hover:text-accent-300">Sign in</Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
