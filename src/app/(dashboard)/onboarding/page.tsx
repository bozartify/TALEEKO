'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, User, BookOpen, Brain, ArrowRight, ArrowLeft, Check
} from 'lucide-react'
import { FadeUp } from '@/components/ui/motion'

const subjects = [
  'Math', 'Science', 'English', 'History', 'Art',
  'Music', 'PE', 'World Languages', 'Computer Science', 'Special Ed'
]

const tones = ['Professional', 'Friendly', 'Casual']
const complexities = ['Simple', 'Standard', 'Advanced']

const steps = [
  { label: 'Welcome', icon: Sparkles },
  { label: 'Profile', icon: User },
  { label: 'Subjects', icon: BookOpen },
  { label: 'AI Prefs', icon: Brain },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [school, setSchool] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [tone, setTone] = useState('Friendly')
  const [complexity, setComplexity] = useState('Standard')
  const [autoSave, setAutoSave] = useState(true)

  function toggleSubject(subject: string) {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    )
  }

  function next() {
    if (step < 3) setStep(step + 1)
    else router.push('/dashboard')
  }

  function back() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <FadeUp>
          <div className="mb-8">
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #dd9a33, #c67954, #829c6e)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="text-center py-12">
                <motion.div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
                  style={{ background: 'linear-gradient(135deg, #dd9a33, #c67954)' }}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-black text-gradient mb-4">Welcome to TeachWeaver</h1>
                <p className="text-surface-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                  Let's personalize your AI teaching assistant. This will only take a minute.
                </p>
                <motion.button
                  onClick={next}
                  className="btn-gradient text-base px-8 py-3"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {step === 1 && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-black text-white mb-2">Set Up Your Profile</h2>
                <p className="text-surface-400 text-sm mb-6">Tell us a bit about yourself so we can tailor your experience.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-surface-200 mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-200 mb-1.5">Grade Level</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)} className="input-base">
                      <option value="">Select grade level</option>
                      <option value="K">Kindergarten</option>
                      <option value="1">1st Grade</option>
                      <option value="2">2nd Grade</option>
                      <option value="3">3rd Grade</option>
                      <option value="4">4th Grade</option>
                      <option value="5">5th Grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                      <option value="higher">Higher Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-200 mb-1.5">School Name</label>
                    <input
                      value={school}
                      onChange={e => setSchool(e.target.value)}
                      placeholder="e.g. Lincoln Middle School"
                      className="input-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-black text-white mb-2">Choose Your Subjects</h2>
                <p className="text-surface-400 text-sm mb-6">Select the subjects you teach. You can change these later.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {subjects.map((subject, i) => {
                    const isSelected = selectedSubjects.includes(subject)
                    return (
                      <motion.button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={`relative p-4 rounded-xl text-sm font-semibold transition-colors ${
                          isSelected
                            ? 'bg-accent-500/20 text-accent-300 border-2 border-accent-500/60'
                            : 'bg-white/[0.03] text-surface-300 border-2 border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isSelected && (
                          <motion.span
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            <Check className="w-4 h-4 text-accent-400" />
                          </motion.span>
                        )}
                        {subject}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-black text-white mb-2">AI Preferences</h2>
                <p className="text-surface-400 text-sm mb-6">Customize how TeachWeaver communicates with you.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-surface-200 mb-3">AI Tone</label>
                    <div className="grid grid-cols-3 gap-3">
                      {tones.map(t => (
                        <motion.button
                          key={t}
                          onClick={() => setTone(t)}
                          className={`p-3 rounded-xl text-sm font-semibold transition-colors ${
                            tone === t
                              ? 'bg-accent-500/20 text-accent-300 border-2 border-accent-500/60'
                              : 'bg-white/[0.03] text-surface-300 border-2 border-white/[0.06] hover:border-white/[0.12]'
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {t}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-200 mb-3">Content Complexity</label>
                    <div className="grid grid-cols-3 gap-3">
                      {complexities.map(c => (
                        <motion.button
                          key={c}
                          onClick={() => setComplexity(c)}
                          className={`p-3 rounded-xl text-sm font-semibold transition-colors ${
                            complexity === c
                              ? 'bg-electric-400/20 text-electric-400 border-2 border-electric-400/60'
                              : 'bg-white/[0.03] text-surface-300 border-2 border-white/[0.06] hover:border-white/[0.12]'
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {c}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-white">Auto-save responses</p>
                      <p className="text-xs text-surface-400">Automatically save AI-generated content to your library</p>
                    </div>
                    <button
                      onClick={() => setAutoSave(!autoSave)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${autoSave ? 'bg-accent-600' : 'bg-surface-600'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${autoSave ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <div>
            {step > 0 && (
              <motion.button
                onClick={back}
                className="btn-secondary text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-accent-400' : i < step ? 'bg-accent-600' : 'bg-white/[0.12]'
                }`}
                animate={{ scale: i === step ? 1.3 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
            ))}
          </div>

          <div>
            {step > 0 && (
              <motion.button
                onClick={next}
                className="btn-gradient text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {step === 3 ? 'Launch Dashboard' : 'Next'} <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
