export interface StudentBase {
  id: string
  name: string
  avatar: string
  grade: string
  color: string
  email: string
  parentEmail: string
  gpa: number
  attendance: number
  streak: number
  awards: number
  trend: 'up' | 'down' | 'flat'
  status: 'excelling' | 'active' | 'needs-attention' | 'at-risk'
  lastActive: string
  iep: boolean
  ell: boolean
  notes: string
  missing: number
  classes: string[]
}

export interface StudentDetail extends StudentBase {
  dob: string
  parentPhone: string
  section504: boolean
  gifted: boolean
  counselor: string
  locker: string
  classDetails: { name: string; period: string; teacher: string; avg: number; grade: string; color: string }[]
  assignments: { name: string; type: string; score: number | null; max: number; submitted: boolean; date: string; feedback: string }[]
  teacherNotes: { date: string; author: string; text: string; type: 'academic' | 'behavior' | 'parent' | 'intervention' }[]
  monthlyScores: { month: string; avg: number }[]
  interventions: { type: string; startDate: string; status: 'active' | 'completed'; progress: number; goal: string }[]
}

export const STUDENTS: StudentBase[] = [
  { id: '1', name: 'Emma Wilson',     avatar: 'EW', grade: '10th', color: '#8b5cf6', email: 'emma.w@student.edu',     parentEmail: 'mrs.wilson@parent.edu',    gpa: 3.92, attendance: 97, streak: 15, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '2h ago',  iep: false, ell: false, notes: 'Excellent analytical skills. Science Olympiad candidate.', missing: 0, classes: ['AP Biology', '10th English'] },
  { id: '2', name: 'Liam Chen',       avatar: 'LC', grade: '10th', color: '#6366f1', email: 'liam.c@student.edu',     parentEmail: 'mr.chen@parent.edu',       gpa: 3.58, attendance: 94, streak: 8,  awards: 2, trend: 'up',   status: 'active',          lastActive: '1h ago',  iep: false, ell: false, notes: 'Strong math skills. Participates well in class discussions.', missing: 0, classes: ['AP Biology', 'Algebra II'] },
  { id: '3', name: 'Sofia Rodriguez', avatar: 'SR', grade: '10th', color: '#f97316', email: 'sofia.r@student.edu',    parentEmail: 'mom.rodriguez@parent.edu', gpa: 2.87, attendance: 91, streak: 3,  awards: 1, trend: 'down', status: 'needs-attention', lastActive: '3d ago',  iep: false, ell: true,  notes: 'ELL student. Improving in reading but struggling with lab reports.', missing: 2, classes: ['AP Biology', '10th English'] },
  { id: '4', name: 'Noah Thompson',   avatar: 'NT', grade: '10th', color: '#10b981', email: 'noah.t@student.edu',     parentEmail: 'dr.thompson@parent.edu',   gpa: 4.10, attendance: 99, streak: 22, awards: 5, trend: 'up',   status: 'excelling',       lastActive: '30m ago', iep: false, ell: false, notes: 'Top performer. Excels in all areas. Peer tutor candidate.', missing: 0, classes: ['AP Biology', 'Algebra II'] },
  { id: '5', name: 'Ava Patel',       avatar: 'AP', grade: '10th', color: '#14b8a6', email: 'ava.p@student.edu',      parentEmail: 'mr.patel@parent.edu',      gpa: 3.38, attendance: 95, streak: 11, awards: 2, trend: 'flat', status: 'active',          lastActive: '3h ago',  iep: false, ell: false, notes: 'Consistent performer. Could benefit from additional challenge.', missing: 0, classes: ['AP Biology', 'Algebra II'] },
  { id: '6', name: 'Mason Kim',       avatar: 'MK', grade: '10th', color: '#ef4444', email: 'mason.k@student.edu',    parentEmail: 'mrs.kim@parent.edu',       gpa: 2.31, attendance: 82, streak: 1,  awards: 0, trend: 'down', status: 'at-risk',         lastActive: '5d ago',  iep: true,  ell: false, notes: 'IEP student. Missing 3 assignments. Parent contact recommended.', missing: 3, classes: ['AP Biology'] },
  { id: '7', name: 'Isabella Jones',  avatar: 'IJ', grade: '10th', color: '#f43f5e', email: 'isabella.j@student.edu', parentEmail: 'ms.jones@parent.edu',      gpa: 3.74, attendance: 96, streak: 19, awards: 3, trend: 'up',   status: 'excelling',       lastActive: '1h ago',  iep: false, ell: false, notes: 'Strong writing skills. Art elective enrichment program.', missing: 0, classes: ['AP Biology', '10th English'] },
  { id: '8', name: 'Ethan Davis',     avatar: 'ED', grade: '10th', color: '#22d3ee', email: 'ethan.d@student.edu',    parentEmail: 'mr.davis@parent.edu',      gpa: 3.12, attendance: 93, streak: 7,  awards: 1, trend: 'flat', status: 'active',          lastActive: '4h ago',  iep: false, ell: false, notes: 'Solid understanding. Participates but could push further.', missing: 1, classes: ['AP Biology'] },
]

const DETAIL_OVERRIDES: Partial<Record<string, Partial<StudentDetail>>> = {
  '1': {
    dob: 'March 14, 2009', parentPhone: '(555) 247-8910', section504: false, gifted: true, counselor: 'Dr. Martinez', locker: 'A-247',
    classDetails: [
      { name: 'AP Biology',   period: 'Period 2', teacher: 'Ms. Johnson',  avg: 94, grade: 'A',  color: '#8b5cf6' },
      { name: '10th English', period: 'Period 4', teacher: 'Mr. Anderson', avg: 91, grade: 'A-', color: '#f43f5e' },
      { name: 'Algebra II',   period: 'Period 6', teacher: 'Ms. Chen',     avg: 89, grade: 'B+', color: '#14b8a6' },
      { name: 'World History',period: 'Period 1', teacher: 'Mr. Roberts',  avg: 87, grade: 'B+', color: '#f97316' },
    ],
    assignments: [
      { name: 'Lab Report: Photosynthesis', type: 'Lab',     score: 71, max: 75,  submitted: true,  date: 'Jul 28', feedback: 'Excellent data analysis! Hypothesis section was precise.' },
      { name: 'Ch. 5 Quiz: Cell Division',  type: 'Quiz',    score: 48, max: 50,  submitted: true,  date: 'Jul 22', feedback: 'Strong performance. Review cytokinesis for the unit test.' },
      { name: 'Essay: The Great Gatsby',    type: 'Essay',   score: 92, max: 100, submitted: true,  date: 'Jul 18', feedback: 'Sophisticated analysis of symbolism. Compelling thesis.' },
      { name: 'Midterm Exam',               type: 'Exam',    score: 178,max: 200, submitted: true,  date: 'Jul 10', feedback: 'Top score in class. Strong across all domains.' },
      { name: 'Science Fair Proposal',      type: 'Project', score: null,max: 50, submitted: false, date: 'Aug 15', feedback: '' },
    ],
    teacherNotes: [
      { date: 'Jul 29', author: 'Ms. Johnson', text: 'Emma showed exceptional insight during genetics discussion. Recommended for Science Olympiad.', type: 'academic' },
      { date: 'Jul 20', author: 'Ms. Johnson', text: 'Spoke with Ms. Wilson (parent) regarding Science Olympiad opportunity. Parent is supportive.', type: 'parent' },
    ],
    monthlyScores: [{ month: 'Mar', avg: 87 }, { month: 'Apr', avg: 89 }, { month: 'May', avg: 90 }, { month: 'Jun', avg: 91 }, { month: 'Jul', avg: 92 }, { month: 'Aug', avg: 94 }],
    interventions: [],
  },
  '3': {
    dob: 'June 22, 2009', parentPhone: '(555) 312-7744', section504: false, gifted: false, counselor: 'Dr. Martinez', locker: 'B-103',
    classDetails: [
      { name: 'AP Biology',   period: 'Period 2', teacher: 'Ms. Johnson',  avg: 72, grade: 'C', color: '#8b5cf6' },
      { name: '10th English', period: 'Period 4', teacher: 'Mr. Anderson', avg: 76, grade: 'C+',color: '#f43f5e' },
    ],
    assignments: [
      { name: 'Lab Report: Photosynthesis', type: 'Lab',  score: 58, max: 75, submitted: true,  date: 'Jul 28', feedback: 'Needs clearer hypothesis. Data table was well-organized.' },
      { name: 'Ch. 5 Quiz: Cell Division',  type: 'Quiz', score: 32, max: 50, submitted: true,  date: 'Jul 22', feedback: 'Review mitosis phases. Strong on vocabulary section.' },
      { name: 'Essay: The Great Gatsby',    type: 'Essay',score: null,max: 100,submitted: false, date: 'Aug 12', feedback: '' },
      { name: 'Midterm Exam',               type: 'Exam', score: 119,max: 200, submitted: true,  date: 'Jul 10', feedback: 'Suggested additional review sessions.' },
    ],
    teacherNotes: [
      { date: 'Jul 30', author: 'Ms. Johnson', text: 'Sofia is working hard but struggling with scientific vocabulary. Recommended ELL support services.', type: 'academic' },
      { date: 'Jul 15', author: 'Dr. Martinez (Counselor)', text: 'Discussed language support options. Sofia is motivated but needs more scaffolding.', type: 'intervention' },
    ],
    monthlyScores: [{ month: 'Mar', avg: 78 }, { month: 'Apr', avg: 76 }, { month: 'May', avg: 74 }, { month: 'Jun', avg: 73 }, { month: 'Jul', avg: 74 }, { month: 'Aug', avg: 74 }],
    interventions: [{ type: 'ELL Support', startDate: 'Jul 15', status: 'active', progress: 40, goal: 'Reach grade-level reading comprehension by end of semester' }],
  },
  '6': {
    dob: 'November 5, 2009', parentPhone: '(555) 889-2233', section504: false, gifted: false, counselor: 'Dr. Martinez', locker: 'C-215',
    classDetails: [
      { name: 'AP Biology', period: 'Period 2', teacher: 'Ms. Johnson', avg: 63, grade: 'D', color: '#8b5cf6' },
    ],
    assignments: [
      { name: 'Lab Report: Photosynthesis', type: 'Lab',  score: null,max: 75, submitted: false, date: 'Jul 28', feedback: '' },
      { name: 'Ch. 5 Quiz: Cell Division',  type: 'Quiz', score: 26, max: 50, submitted: true,  date: 'Jul 22', feedback: 'Struggled with concept application. Retake available.' },
      { name: 'Essay: The Great Gatsby',    type: 'Essay',score: null,max: 100,submitted: false, date: 'Jul 18', feedback: '' },
      { name: 'Midterm Exam',               type: 'Exam', score: 97, max: 200, submitted: true,  date: 'Jul 10', feedback: 'Below passing. IEP accommodations should be applied.' },
    ],
    teacherNotes: [
      { date: 'Jul 31', author: 'Ms. Johnson', text: 'Mason has missed 3 assignments. Parent contact attempted — no response. Will try again this week.', type: 'behavior' },
      { date: 'Jul 10', author: 'Dr. Martinez (Counselor)', text: 'IEP review meeting held. Extended time and reduced-distraction environment approved for all assessments.', type: 'intervention' },
    ],
    monthlyScores: [{ month: 'Mar', avg: 71 }, { month: 'Apr', avg: 68 }, { month: 'May', avg: 65 }, { month: 'Jun', avg: 63 }, { month: 'Jul', avg: 62 }, { month: 'Aug', avg: 63 }],
    interventions: [
      { type: 'IEP - Extended Time', startDate: 'Sep 1', status: 'active', progress: 60, goal: 'Complete all assessments with appropriate accommodations' },
      { type: 'Check-in / Check-out', startDate: 'Jul 15', status: 'active', progress: 30, goal: 'Improve assignment completion rate to 80%' },
    ],
  },
}

function generateDetail(base: StudentBase): StudentDetail {
  const override = DETAIL_OVERRIDES[base.id] ?? {}
  const avgScore = Math.round(base.gpa * 25)
  const classes = base.classes.length > 0 ? base.classes : ['AP Biology']

  return {
    ...base,
    dob: override.dob ?? 'January 1, 2009',
    parentPhone: override.parentPhone ?? '(555) 000-0000',
    section504: override.section504 ?? false,
    gifted: override.gifted ?? (base.gpa >= 3.8),
    counselor: override.counselor ?? 'Dr. Martinez',
    locker: override.locker ?? `A-${100 + parseInt(base.id) * 17}`,
    classDetails: override.classDetails ?? classes.map((c, i) => ({
      name: c,
      period: `Period ${i * 2 + 1}`,
      teacher: ['Ms. Johnson', 'Mr. Anderson', 'Ms. Chen', 'Mr. Roberts'][i % 4],
      avg: Math.max(50, avgScore + (i % 3 === 0 ? 2 : i % 3 === 1 ? -3 : 1)),
      grade: avgScore >= 90 ? 'A' : avgScore >= 83 ? 'B' : avgScore >= 73 ? 'C' : 'D',
      color: ['#8b5cf6', '#f43f5e', '#14b8a6', '#f97316'][i % 4],
    })),
    assignments: override.assignments ?? [
      { name: 'Lab Report: Photosynthesis', type: 'Lab',  score: Math.round(avgScore * 0.75), max: 75, submitted: true,  date: 'Jul 28', feedback: 'Good effort.' },
      { name: 'Ch. 5 Quiz: Cell Division',  type: 'Quiz', score: Math.round(avgScore * 0.50), max: 50, submitted: true,  date: 'Jul 22', feedback: '' },
      { name: 'Midterm Exam',               type: 'Exam', score: Math.round(avgScore * 2.00), max: 200, submitted: true,  date: 'Jul 10', feedback: '' },
      { name: 'Homework Set #4',            type: 'HW',   score: null, max: 20, submitted: false, date: 'Aug 5',  feedback: '' },
    ],
    teacherNotes: override.teacherNotes ?? [
      { date: 'Jul 29', author: 'Ms. Johnson', text: base.notes, type: 'academic' },
    ],
    monthlyScores: override.monthlyScores ?? [
      { month: 'Mar', avg: Math.max(50, avgScore - 7) },
      { month: 'Apr', avg: Math.max(50, avgScore - 5) },
      { month: 'May', avg: Math.max(50, avgScore - 3) },
      { month: 'Jun', avg: Math.max(50, avgScore - 2) },
      { month: 'Jul', avg: Math.max(50, avgScore - 1) },
      { month: 'Aug', avg: avgScore },
    ],
    interventions: override.interventions ?? (base.status === 'at-risk' ? [
      { type: 'Academic Support', startDate: 'Jul 1', status: 'active', progress: 40, goal: 'Improve overall GPA by 0.5 points' },
    ] : []),
  }
}

export function getStudentDetail(id: string): StudentDetail | null {
  const base = STUDENTS.find(s => s.id === id)
  if (!base) return null
  return generateDetail(base)
}

export function getAllStudents(): StudentBase[] {
  return STUDENTS
}
