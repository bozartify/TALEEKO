import Link from 'next/link'
import {
  BookOpen, ClipboardList, FileText, Zap, BarChart2, Sparkles,
  ChevronRight, Wand2, Layers, PenTool, MessageSquare
} from 'lucide-react'

const toolCategories = [
  {
    title: 'Content Creation',
    tools: [
      { href: '/magic-chat?mode=lesson',    icon: BookOpen,      label: 'Lesson Plan Generator',  desc: 'Create full lesson plans with objectives, activities, and assessments', color: 'bg-brand-100 text-brand-600' },
      { href: '/magic-chat?mode=quiz',      icon: ClipboardList, label: 'Quiz & Assessment',       desc: 'Generate quizzes with multiple question types and auto answer keys', color: 'bg-orange-100 text-orange-600' },
      { href: '/magic-chat?mode=worksheet', icon: FileText,      label: 'Student Worksheet',       desc: 'Build targeted practice sheets and exercises for any topic', color: 'bg-emerald-100 text-emerald-600' },
      { href: '/magic-chat?mode=activity',  icon: Zap,           label: 'Classroom Activity',      desc: 'Design engaging individual, partner, or group activities', color: 'bg-amber-100 text-amber-600' },
    ]
  },
  {
    title: 'Analysis & Insights',
    tools: [
      { href: '/magic-chat',  icon: BarChart2,     label: 'Lesson Analyzer',    desc: 'Get AI feedback and improvement suggestions on any lesson', color: 'bg-sky-100 text-sky-600' },
      { href: '/analytics',   icon: TrendingUp,    label: 'Usage Analytics',    desc: 'Track your teaching productivity and material performance', color: 'bg-rose-100 text-rose-600' },
    ]
  },
  {
    title: 'AI Assistants',
    tools: [
      { href: '/magic-chat', icon: Sparkles,       label: 'Magic Chat',         desc: 'Your always-on AI co-teacher for any question or request', color: 'bg-purple-100 text-purple-600' },
      { href: '/magic-chat', icon: MessageSquare,  label: 'Feedback Writer',    desc: 'Generate personalized student feedback and report comments', color: 'bg-indigo-100 text-indigo-600' },
      { href: '/magic-chat', icon: Wand2,          label: 'Content Rewriter',   desc: 'Adapt any material for different reading levels or needs', color: 'bg-teal-100 text-teal-600' },
      { href: '/magic-chat', icon: PenTool,        label: 'Rubric Builder',     desc: 'Create detailed assessment rubrics for any assignment type', color: 'bg-cyan-100 text-cyan-600' },
    ]
  },
]

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="hero-mesh rounded-3xl p-6 border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">All AI Tools</h2>
            <p className="text-xs text-slate-500">Everything you need in one place</p>
          </div>
        </div>
      </div>

      {/* Tool categories */}
      {toolCategories.map((cat) => (
        <div key={cat.title}>
          <h3 className="text-base font-bold text-slate-900 mb-4">{cat.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cat.tools.map((tool) => (
              <Link key={tool.label} href={tool.href} className="tool-card group flex items-start gap-4">
                <div className={`icon-bubble ${tool.color} flex-shrink-0`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">{tool.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{tool.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 flex-shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
