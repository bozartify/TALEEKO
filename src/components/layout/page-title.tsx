'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard | TALEEKO',
  '/lesson-planner': 'Lesson Planner | TALEEKO',
  '/unit-planner': 'Unit Planner | TALEEKO',
  '/quiz-builder': 'Quiz Builder | TALEEKO',
  '/assessment-center': 'Assessment Center | TALEEKO',
  '/exit-tickets': 'Exit Tickets | TALEEKO',
  '/gradebook': 'Gradebook | TALEEKO',
  '/attendance': 'Attendance | TALEEKO',
  '/assignments': 'Assignments | TALEEKO',
  '/progress-monitor': 'Progress Monitor | TALEEKO',
  '/report-cards': 'Report Cards | TALEEKO',
  '/rubrics': 'Rubric Builder | TALEEKO',
  '/standards-unpacker': 'Standards Unpacker | TALEEKO',
  '/standards': 'Standards Library | TALEEKO',
  '/blooms-taxonomy': "Bloom's Taxonomy | TALEEKO",
  '/discussion-prompts': 'Discussion Prompts | TALEEKO',
  '/writing-prompts': 'Writing Prompts | TALEEKO',
  '/feedback-writer': 'Feedback Writer | TALEEKO',
  '/text-leveler': 'Text Leveler | TALEEKO',
  '/5e-lesson': '5E Lesson Builder | TALEEKO',
  '/differentiation': 'Differentiation | TALEEKO',
  '/iep-goals': 'IEP Goals | TALEEKO',
  '/accommodations': 'Accommodations | TALEEKO',
  '/intervention-tracker': 'Intervention Tracker | TALEEKO',
  '/word-wall': 'Word Wall | TALEEKO',
  '/game-builder': 'Game Builder | TALEEKO',
  '/sub-plans': 'Sub Plans | TALEEKO',
  '/seating-chart': 'Seating Chart | TALEEKO',
  '/portfolio': 'Student Portfolios | TALEEKO',
  '/professional-dev': 'Professional Development | TALEEKO',
  '/communication': 'Communication | TALEEKO',
  '/newsletter': 'Newsletter Generator | TALEEKO',
  '/parent-portal': 'Parent Portal | TALEEKO',
  '/calendar': 'Calendar | TALEEKO',
  '/groups': 'Student Groups | TALEEKO',
  '/agents': 'AI Agents | TALEEKO',
  '/magic-chat': 'Magic Chat | TALEEKO',
  '/integrations': 'Integrations | TALEEKO',
  '/api-keys': 'API Keys | TALEEKO',
  '/workspace': 'Workspace | TALEEKO',
  '/analytics': 'Analytics | TALEEKO',
  '/reports': 'Reports | TALEEKO',
  '/library': 'Resource Library | TALEEKO',
  '/templates': 'Templates | TALEEKO',
  '/notifications': 'Notifications | TALEEKO',
  '/settings': 'Settings | TALEEKO',
  '/help': 'Help & Support | TALEEKO',
  '/scope-sequence': 'Scope & Sequence | TALEEKO',
  '/curriculum': 'Curriculum | TALEEKO',
  '/learning-paths': 'Learning Paths | TALEEKO',
  '/courses': 'Courses | TALEEKO',
  '/students': 'Students | TALEEKO',
}

export default function PageTitle() {
  const pathname = usePathname()

  useEffect(() => {
    const exact = PAGE_TITLES[pathname]
    if (exact) { document.title = exact; return }
    const base = '/' + pathname.split('/')[1]
    const fallback = PAGE_TITLES[base]
    if (fallback) document.title = fallback
  }, [pathname])

  return null
}
