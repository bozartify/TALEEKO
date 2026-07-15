import { ClipboardList, Clock, CheckCircle } from 'lucide-react'

interface Question {
  number?: number
  type?: string
  question: string
  options?: string[]
  answer?: string
  explanation?: string
  points?: number
}

interface Props { data: Record<string, unknown> }

export default function QuizCard({ data }: Props) {
  const questions = (data.questions as Question[]) ?? []

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-orange-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-orange-50" style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(234,88,12,0.04))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Quiz</p>
            <h3 className="font-black text-slate-900 text-sm">{String(data.title ?? 'Quiz')}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {!!data.subject    && <span className="badge bg-orange-100 text-orange-700">{String(data.subject)}</span>}
          {!!data.grade      && <span className="badge bg-slate-100 text-slate-600">Grade {String(data.grade)}</span>}
          {!!data.difficulty && <span className="badge bg-slate-100 text-slate-600">{String(data.difficulty)}</span>}
          {!!data.totalPoints && <span className="badge bg-orange-100 text-orange-700">{String(data.totalPoints)} pts</span>}
          {!!data.timeLimit && (
            <span className="badge bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3" />{String(data.timeLimit)} min
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {q.number ?? i + 1}
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900">{q.question}</p>
                {q.type && <span className="badge bg-slate-200 text-slate-500 mt-1">{q.type.replace('_', ' ')}</span>}
              </div>
              {q.points && <span className="text-xs text-slate-400 flex-shrink-0">{q.points}pt</span>}
            </div>

            {/* MC options */}
            {Array.isArray(q.options) && q.options.length > 0 && (
              <div className="pl-7 space-y-1 mb-2">
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-4">{String.fromCharCode(65 + j)}.</span>
                    <span className="text-xs text-slate-600">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Answer */}
            {q.answer && (
              <div className="pl-7 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 font-medium">{q.answer}</p>
              </div>
            )}
            {q.explanation && (
              <p className="pl-7 mt-1 text-xs text-slate-400 italic">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
