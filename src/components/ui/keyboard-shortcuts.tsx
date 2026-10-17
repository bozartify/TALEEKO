'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command } from 'lucide-react'

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'], desc: 'Quick search' },
    { keys: ['Ctrl', 'D'], desc: 'Go to Dashboard' },
    { keys: ['Ctrl', 'M'], desc: 'Open Magic Chat' },
    { keys: ['Ctrl', 'N'], desc: 'New content' },
  ]},
  { category: 'AI Tools', items: [
    { keys: ['Ctrl', 'Shift', 'L'], desc: 'Generate lesson plan' },
    { keys: ['Ctrl', 'Shift', 'Q'], desc: 'Generate quiz' },
    { keys: ['Ctrl', 'Shift', 'W'], desc: 'Generate worksheet' },
    { keys: ['Ctrl', 'Shift', 'A'], desc: 'Generate activity' },
  ]},
  { category: 'Editor', items: [
    { keys: ['Ctrl', 'S'], desc: 'Save changes' },
    { keys: ['Ctrl', 'Z'], desc: 'Undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo' },
    { keys: ['Esc'], desc: 'Close modal / Cancel' },
  ]},
]

export function KeyboardShortcuts({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="glass-card p-6 mx-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Command className="w-4 h-4 text-accent-400" />
                  <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
                </div>
                <button onClick={onClose} className="text-surface-500 hover:text-surface-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-5">
                {shortcuts.map(group => (
                  <div key={group.category}>
                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">{group.category}</h3>
                    <div className="space-y-1.5">
                      {group.items.map(item => (
                        <div key={item.desc} className="flex items-center justify-between py-1.5">
                          <span className="text-xs text-surface-300">{item.desc}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map(k => (
                              <kbd key={k} className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-surface-300 bg-white/[0.06] border border-white/[0.08] rounded">
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
