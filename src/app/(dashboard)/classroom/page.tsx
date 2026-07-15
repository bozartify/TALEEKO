import Link from 'next/link'
import { Users, BookOpen, ChevronRight, Plus, Mail, MoreHorizontal } from 'lucide-react'

const classes = [
  { name: '7th Grade Science', students: 28, lessons: 12, color: '#8b5cf6', subject: 'Biology & Earth Science', period: '1st Period' },
  { name: '8th Grade History', students: 31, lessons: 9,  color: '#f97316', subject: 'American History',        period: '3rd Period' },
  { name: '9th Grade Math',    students: 25, lessons: 15, color: '#14b8a6', subject: 'Algebra I',              period: '5th Period' },
  { name: '10th Grade English',students: 29, lessons: 8,  color: '#f43f5e', subject: 'Literature & Writing',   period: '7th Period' },
]

const students = [
  { name: 'Emma Rodriguez',  grade: '7th', class: 'Science', avg: 92, status: 'active' },
  { name: 'James Kim',       grade: '8th', class: 'History', avg: 87, status: 'active' },
  { name: 'Aisha Thompson',  grade: '9th', class: 'Math',    avg: 95, status: 'active' },
  { name: 'Liam Chen',       grade: '10th',class: 'English', avg: 78, status: 'needs-attention' },
  { name: 'Sofia Patel',     grade: '7th', class: 'Science', avg: 88, status: 'active' },
  { name: 'Noah Williams',   grade: '8th', class: 'History', avg: 71, status: 'needs-attention' },
]

export default function ClassroomPage() {
  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Manage your classes and students</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Classes grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">My Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div key={cls.name} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-hover transition-all cursor-pointer">
              <div className="h-2" style={{ backgroundColor: cls.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{cls.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{cls.subject} · {cls.period}</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{cls.students}</span>
                    <span className="text-slate-400 text-xs">students</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900">{cls.lessons}</span>
                    <span className="text-slate-400 text-xs">lessons</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link href="/courses" className="btn-outline text-xs px-3 py-1.5">View lessons</Link>
                  <button className="text-slate-400 hover:text-brand-600 p-1.5 rounded-lg hover:bg-brand-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Students</h3>
          <button className="btn-secondary text-xs">Export roster</button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Student</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Grade</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Avg Score</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.name} className={`hover:bg-slate-50 transition-colors ${i < students.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{s.grade}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{s.class}</td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-bold ${
                        s.avg >= 90 ? 'text-emerald-600' :
                        s.avg >= 80 ? 'text-brand-600' :
                        s.avg >= 70 ? 'text-amber-600' : 'text-red-500'
                      }`}>{s.avg}%</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${
                        s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {s.status === 'active' ? 'On track' : 'Needs attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
