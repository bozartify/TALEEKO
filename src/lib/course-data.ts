export interface CourseBase {
  id: string
  title: string
  subject: string
  grade: string
  color: string
  lessons: number
  students: number
  completion: number
  description: string
  lastUpdated: string
  status: 'active' | 'draft' | 'archived'
  nextMilestone?: string
}

export const COURSES: CourseBase[] = [
  { id: '1', title: '7th Grade Biology',    subject: 'Science',  grade: '7th',  color: '#8b5cf6', lessons: 12, students: 28, completion: 75, description: 'Life science covering cells, ecosystems, genetics, and the diversity of living organisms.', lastUpdated: 'Today', status: 'active', nextMilestone: 'Genetics Unit starts Oct 14' },
  { id: '2', title: 'American History 8',   subject: 'History',  grade: '8th',  color: '#f97316', lessons: 9,  students: 24, completion: 60, description: 'Colonial era through Reconstruction, including key events, figures, and social movements.', lastUpdated: 'Yesterday', status: 'active', nextMilestone: 'Primary Source Analysis Oct 18' },
  { id: '3', title: 'Algebra I',            subject: 'Math',     grade: '9th',  color: '#14b8a6', lessons: 15, students: 30, completion: 85, description: 'Linear equations, inequalities, systems of equations, and introduction to functions.', lastUpdated: '2 days ago', status: 'active' },
  { id: '4', title: 'English Literature 10',subject: 'English',  grade: '10th', color: '#f43f5e', lessons: 8,  students: 22, completion: 45, description: 'Classic and contemporary literature analysis with focus on critical reading and writing.', lastUpdated: '3 days ago', status: 'active', nextMilestone: 'Essay Drafts due Oct 20' },
  { id: '5', title: 'Earth Science 6',      subject: 'Science',  grade: '6th',  color: '#06b6d4', lessons: 10, students: 26, completion: 90, description: 'Geology, weather systems, plate tectonics, and the water cycle.', lastUpdated: '4 days ago', status: 'active' },
  { id: '6', title: 'Creative Writing',     subject: 'English',  grade: '11th', color: '#ec4899', lessons: 6,  students: 18, completion: 30, description: 'Fiction, poetry, and narrative techniques with peer workshop sessions.', lastUpdated: '5 days ago', status: 'active', nextMilestone: 'Workshop Session Oct 16' },
  { id: '7', title: 'Geometry',             subject: 'Math',     grade: '10th', color: '#22c55e', lessons: 11, students: 32, completion: 55, description: 'Shapes, proofs, congruence, similarity, and coordinate geometry fundamentals.', lastUpdated: '1 week ago', status: 'active' },
  { id: '8', title: 'World Geography',      subject: 'History',  grade: '6th',  color: '#f59e0b', lessons: 7,  students: 20, completion: 0, description: 'Physical and human geography across continents, cultures, and environments.', lastUpdated: '2 weeks ago', status: 'draft' },
]

interface CourseDetail extends CourseBase {
  units: { id: string; title: string; lessons: { id: string; title: string; type: string; duration: number; status: 'complete' | 'in-progress' | 'upcoming' }[] }[]
  upcomingDeadlines: { title: string; date: string; class: string }[]
  aiInsights: { type: string; message: string; action: string }[]
}

const UNIT_TEMPLATES: Record<string, CourseDetail['units']> = {
  '1': [
    { id: 'u1', title: 'Unit 1: Cell Biology', lessons: [
      { id: 'l1', title: 'Introduction to Cell Theory', type: 'Lesson', duration: 50, status: 'complete' },
      { id: 'l2', title: 'Cell Structure & Organelles', type: 'Lab', duration: 60, status: 'complete' },
      { id: 'l3', title: 'Cell Division: Mitosis', type: 'Lesson', duration: 50, status: 'complete' },
      { id: 'l4', title: 'Cell Division Quiz', type: 'Quiz', duration: 30, status: 'complete' },
    ]},
    { id: 'u2', title: 'Unit 2: Genetics & Heredity', lessons: [
      { id: 'l5', title: 'Introduction to Genetics', type: 'Lesson', duration: 50, status: 'in-progress' },
      { id: 'l6', title: 'Punnett Squares Activity', type: 'Activity', duration: 45, status: 'upcoming' },
      { id: 'l7', title: 'DNA Structure & Replication', type: 'Lesson', duration: 55, status: 'upcoming' },
    ]},
    { id: 'u3', title: 'Unit 3: Ecosystems', lessons: [
      { id: 'l8', title: 'Food Webs & Energy Flow', type: 'Lesson', duration: 50, status: 'upcoming' },
      { id: 'l9', title: 'Biome Research Project', type: 'Project', duration: 90, status: 'upcoming' },
    ]},
    { id: 'u4', title: 'Unit 4: Human Body Systems', lessons: [
      { id: 'l10', title: 'Digestive & Circulatory Systems', type: 'Lesson', duration: 50, status: 'upcoming' },
      { id: 'l11', title: 'Body Systems Lab', type: 'Lab', duration: 60, status: 'upcoming' },
      { id: 'l12', title: 'Final Exam', type: 'Exam', duration: 90, status: 'upcoming' },
    ]},
  ],
  '2': [
    { id: 'u1', title: 'Unit 1: Colonial America', lessons: [
      { id: 'l1', title: 'Founding of the Colonies', type: 'Lesson', duration: 50, status: 'complete' },
      { id: 'l2', title: 'Colonial Life & Society', type: 'Lesson', duration: 50, status: 'complete' },
    ]},
    { id: 'u2', title: 'Unit 2: American Revolution', lessons: [
      { id: 'l3', title: 'Road to Revolution', type: 'Lesson', duration: 50, status: 'complete' },
      { id: 'l4', title: 'Primary Source Analysis', type: 'Activity', duration: 60, status: 'in-progress' },
      { id: 'l5', title: 'Declaration of Independence', type: 'Lesson', duration: 50, status: 'upcoming' },
    ]},
    { id: 'u3', title: 'Unit 3: New Nation', lessons: [
      { id: 'l6', title: 'Constitution & Bill of Rights', type: 'Lesson', duration: 50, status: 'upcoming' },
      { id: 'l7', title: 'Westward Expansion', type: 'Lesson', duration: 50, status: 'upcoming' },
      { id: 'l8', title: 'Civil War Era', type: 'Lesson', duration: 55, status: 'upcoming' },
    ]},
    { id: 'u4', title: 'Unit 4: Reconstruction', lessons: [
      { id: 'l9', title: 'Reconstruction Era', type: 'Lesson', duration: 50, status: 'upcoming' },
    ]},
  ],
}

function generateUnits(course: CourseBase): CourseDetail['units'] {
  if (UNIT_TEMPLATES[course.id]) return UNIT_TEMPLATES[course.id]
  const lessonTitles = {
    Science:  ['Introduction', 'Lab: Observation', 'Core Concepts', 'Application Activity', 'Review & Assessment'],
    Math:     ['Lesson: New Concepts', 'Practice Problems', 'Group Activity', 'Test Prep', 'Quiz'],
    History:  ['Historical Context', 'Primary Sources', 'Timeline Analysis', 'Discussion', 'Assessment'],
    English:  ['Reading: Chapter 1', 'Literary Analysis', 'Writing Workshop', 'Discussion Circle', 'Final Project'],
  }
  const titles = lessonTitles[course.subject as keyof typeof lessonTitles] ?? lessonTitles.English
  const types = ['Lesson', 'Activity', 'Lab', 'Quiz', 'Discussion']
  const n = Math.ceil(course.lessons / 3)
  return Array.from({ length: 3 }, (_, ui) => ({
    id: `u${ui + 1}`,
    title: `Unit ${ui + 1}: ${course.title.split(' ').slice(-2).join(' ')} Part ${ui + 1}`,
    lessons: Array.from({ length: n }, (_, li) => {
      const idx = ui * n + li
      const doneFraction = course.completion / 100
      const status: 'complete' | 'in-progress' | 'upcoming' = idx / course.lessons < doneFraction ? 'complete' : idx / course.lessons < doneFraction + 0.1 ? 'in-progress' : 'upcoming'
      return { id: `l${idx + 1}`, title: titles[li % titles.length], type: types[li % types.length], duration: 50, status }
    }),
  }))
}

export function getCourseDetail(id: string): CourseDetail | null {
  const base = COURSES.find(c => c.id === id)
  if (!base) return null
  return {
    ...base,
    units: generateUnits(base),
    upcomingDeadlines: [
      { title: `${base.title} — Unit Quiz`, date: 'Oct 14', class: base.title },
      { title: `Lab Report Due`, date: 'Oct 18', class: base.title },
      { title: `Unit Test`, date: 'Nov 2', class: base.title },
    ],
    aiInsights: [
      { type: 'warning', message: `${Math.round(base.students * 0.2)} students below 70% on last assessment`, action: 'Plan intervention' },
      { type: 'success', message: `Completion rate ${base.completion}% — on track for semester goal`, action: 'View analytics' },
      { type: 'info', message: `No lesson scheduled for Oct 17 — consider adding a review session`, action: 'Generate now' },
    ],
  }
}

export function getAllCourses(): CourseBase[] {
  return COURSES
}
