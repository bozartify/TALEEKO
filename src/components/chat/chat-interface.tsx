'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Send, Square, BookOpen, ClipboardList, FileText, Zap, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import ToolResultCard from './tool-result-card'
import type { ChatMessage, TeachingMode } from '@/types'

const MODES: { id: TeachingMode; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'general',   label: 'General',  icon: MessageSquare, color: 'text-surface-400' },
  { id: 'lesson',    label: 'Lesson',   icon: BookOpen,      color: 'text-accent-400' },
  { id: 'quiz',      label: 'Quiz',     icon: ClipboardList, color: 'text-warning-400' },
  { id: 'worksheet', label: 'Sheet',    icon: FileText,      color: 'text-success-400' },
  { id: 'activity',  label: 'Activity', icon: Zap,           color: 'text-warning-400' },
]

const STARTERS = [
  'Create a 45-min lesson on photosynthesis for 7th grade',
  'Make a 10-question quiz on the American Revolution',
  'Build a worksheet on solving linear equations for 9th grade',
  'Design a group activity for Shakespeare for 10th grade',
]

export default function ChatInterface() {
  const searchParams = useSearchParams()
  const initialMode = (searchParams.get('mode') as TeachingMode) ?? 'general'

  const [mode, setMode] = useState<TeachingMode>(initialMode)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taleeko_chat_history')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return []
  })
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const autoResize = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [])

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      toolResults: [],
      timestamp: new Date(),
    }])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, mode }),
        signal: controller.signal,
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'text') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
              ))
            } else if (parsed.type === 'tool_result') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, toolResults: [...(m.toolResults ?? []), { type: parsed.tool.name, data: parsed.tool.input }] }
                  : m
              ))
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: 'Sorry, something went wrong. Please try again.' } : m
        ))
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
      setMessages(prev => {
        try { localStorage.setItem('taleeko_chat_history', JSON.stringify(prev.slice(-50))) } catch {}
        return prev
      })
    }
  }

  function clearChat() {
    setMessages([])
    try { localStorage.removeItem('taleeko_chat_history') } catch {}
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/[0.04]">
      {/* Mode tabs */}
      <div className="border-b border-white/[0.06] px-4 pt-3 pb-0 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all whitespace-nowrap',
                mode === m.id
                  ? 'border-accent-400 text-accent-300 bg-accent-500/10'
                  : 'border-transparent text-surface-400 hover:text-surface-200 hover:bg-white/[0.03]'
              )}
            >
              <m.icon className={cn('w-3.5 h-3.5', mode === m.id ? 'text-accent-400' : m.color)} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-2">Magic Chat</h3>
              <p className="text-sm text-surface-400 max-w-sm">
                Your AI co-teacher. Ask anything or pick a starter below.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 bg-white/[0.03] hover:bg-accent-500/10 hover:border-accent-500/20 border border-white/[0.06] rounded-xl text-xs text-surface-400 hover:text-accent-300 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={cn('max-w-2xl', msg.role === 'user' ? 'items-end' : 'items-start', 'flex flex-col gap-2')}>
              {msg.content && (
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm',
                    msg.role === 'user'
                      ? 'bg-accent-500/20 text-accent-100 rounded-tr-sm border border-accent-500/10'
                      : 'bg-white/[0.06] text-surface-200 rounded-tl-sm border border-white/[0.06]'
                  )}
                >
                  {msg.role === 'assistant' && isStreaming && msg.content === '' ? (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-neon-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : (
                    <div className="ai-prose whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              )}
              {msg.toolResults?.map((tr, i) => (
                <ToolResultCard key={i} type={tr.type} data={tr.data} />
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface-900/80 backdrop-blur-xl border-t border-white/[0.06] p-4 flex-shrink-0">
        <div className="flex items-end gap-2 bg-white/[0.04] rounded-2xl border border-white/[0.08] p-2 focus-within:border-accent-400/40 focus-within:ring-2 focus-within:ring-accent-500/10 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKeyDown}
            placeholder={`Ask TALEEKO AI anything${mode !== 'general' ? ` (${mode} mode)` : ''}...`}
            className="flex-1 bg-transparent text-sm text-surface-200 placeholder:text-surface-500 resize-none focus:outline-none px-2 py-1 min-h-[36px] max-h-40"
            rows={1}
          />
          {isStreaming ? (
            <button
              onClick={() => abortRef.current?.abort()}
              className="w-9 h-9 rounded-xl bg-danger-500/20 text-danger-400 hover:bg-danger-500/30 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-surface-500">Shift+Enter for new line · Enter to send</p>
          {messages.length > 0 && !isStreaming && (
            <button onClick={clearChat} className="text-xs text-surface-600 hover:text-surface-400 transition-colors">
              Clear history
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
